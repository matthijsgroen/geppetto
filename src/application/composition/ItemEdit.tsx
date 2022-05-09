import produce from "immer";
import { useCallback } from "react";
import { hasRadius, iconMapping } from "../../animation/file2/mutation";
import { NodeType, TreeNode } from "../../animation/file2/types";
import { Control, ControlPanel, Icon, Title } from "../../ui-components";
import { useFile } from "../applicationMenu/FileContext";
import { BooleanControl } from "../controls/CheckControl";
import { NumberControl } from "../controls/NumberControl";
import { VectorControl } from "../controls/VectorControl";

type ItemEditProps = {
  selectedShapeIds: string[];
  selectedControlIds: string[];
};

type EditProps<T extends NodeType> = {
  item: TreeNode<T>;
  itemId: string;
};

const LayerEdit: React.FC<EditProps<"layer">> = ({ itemId }) => {
  const [file] = useFile();
  const layer = file.layers[itemId];
  return (
    <>
      <Title>
        <Icon>📄</Icon> {layer.name}
      </Title>
      <ControlPanel>
        <VectorControl label="Offset" value={layer.translate} />
        <Control label="Visible">
          <input type="checkbox" />
        </Control>
      </ControlPanel>
    </>
  );
};

const MutationEdit: React.FC<EditProps<"mutation">> = ({ itemId }) => {
  const [file, setFile] = useFile();
  const mutation = file.mutations[itemId];

  const affectingControls = Object.entries(file.controls).filter(
    ([, control]) =>
      control.steps.some((frame) =>
        Object.keys(frame).some((key) => key === itemId)
      )
  );

  const radiusChange = useCallback(
    (newRadius: number) => {
      setFile(
        produce((draft) => {
          const mutation = draft.mutations[itemId];
          if (hasRadius(mutation)) {
            mutation.radius = newRadius;
          }
        })
      );
    },
    [setFile, itemId]
  );

  const toggleRadius = useCallback(
    (value: boolean) => {
      setFile(
        produce((draft) => {
          const mutation = draft.mutations[itemId];
          if (hasRadius(mutation)) {
            mutation.radius = value ? 10 : -1;
          }
        })
      );
    },
    [setFile, itemId]
  );

  return (
    <>
      <Title>
        <Icon>{iconMapping[mutation.type]}</Icon> {mutation.name}
      </Title>
      <ControlPanel>
        <VectorControl label="Origin" value={mutation.origin} />
        {hasRadius(mutation) && (
          <>
            <BooleanControl
              label="Use radius"
              value={mutation.radius !== -1}
              onChange={toggleRadius}
            />
            {mutation.radius !== -1 && (
              <NumberControl
                label="Radius"
                value={mutation.radius}
                minValue={0}
                onChange={radiusChange}
              />
            )}
          </>
        )}
        {affectingControls.length > 0 && (
          <Control label="Controlled by">
            <p>{affectingControls.map(([, c]) => c.name).join(", ")}</p>
          </Control>
        )}
        <VectorControl label="Value" value={file.defaultFrame[itemId]} />
      </ControlPanel>
    </>
  );
};

export const ItemEdit: React.FC<ItemEditProps> = ({
  selectedShapeIds,
  selectedControlIds,
}) => {
  const [file] = useFile();
  const activeShapeId =
    selectedShapeIds.length === 1 ? selectedShapeIds[0] : null;
  const hierarchyItem =
    activeShapeId !== null ? file.layerHierarchy[activeShapeId] : null;
  return (
    <>
      {activeShapeId !== null &&
        hierarchyItem &&
        hierarchyItem.type === "layer" && (
          <LayerEdit
            item={hierarchyItem as TreeNode<"layer">}
            itemId={activeShapeId}
          />
        )}
      {activeShapeId !== null &&
        hierarchyItem &&
        hierarchyItem.type === "mutation" && (
          <MutationEdit
            item={hierarchyItem as TreeNode<"mutation">}
            itemId={activeShapeId}
          />
        )}
    </>
  );
};
