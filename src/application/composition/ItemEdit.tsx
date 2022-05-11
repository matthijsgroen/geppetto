import produce from "immer";
import { useCallback } from "react";
import { hasRadius, iconMapping } from "../../animation/file2/mutation";
import { NodeType, TreeNode } from "../../animation/file2/types";
import { Vec2 } from "../../types";
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

const LayerFolderEdit: React.FC<EditProps<"layerFolder">> = ({ itemId }) => {
  const [file] = useFile();
  const layerFolder = file.layerFolders[itemId];

  return (
    <>
      <Title>
        <Icon>📁</Icon> {layerFolder.name}
      </Title>
      <ControlPanel>
        <Control label="Visible">
          <input type="checkbox" />
        </Control>
      </ControlPanel>
    </>
  );
};

const LayerEdit: React.FC<EditProps<"layer">> = ({ itemId }) => {
  const [file, setFile] = useFile();
  const layer = file.layers[itemId];

  const offsetChangeHandler = useCallback(
    (newValue: Vec2) => {
      setFile(
        produce((draft) => {
          draft.layers[itemId].translate = newValue;
        })
      );
    },
    [setFile, itemId]
  );

  return (
    <>
      <Title>
        <Icon>📄</Icon> {layer.name}
      </Title>
      <ControlPanel>
        <VectorControl
          label="Offset"
          value={layer.translate}
          onChange={offsetChangeHandler}
        />
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
    (newValue: boolean) => {
      setFile(
        produce((draft) => {
          const mutation = draft.mutations[itemId];
          if (hasRadius(mutation)) {
            mutation.radius = newValue ? 10 : -1;
          }
        })
      );
    },
    [setFile, itemId]
  );

  const valueChangeHandler = useCallback(
    (newValue: Vec2) => {
      setFile(
        produce((draft) => {
          draft.defaultFrame[itemId] = newValue;
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
        <VectorControl
          label="Value"
          value={file.defaultFrame[itemId]}
          onChange={valueChangeHandler}
        />
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

  if (
    activeShapeId !== null &&
    hierarchyItem &&
    hierarchyItem.type === "layer"
  ) {
    return (
      <LayerEdit
        item={hierarchyItem as TreeNode<"layer">}
        itemId={activeShapeId}
      />
    );
  }
  if (
    activeShapeId !== null &&
    hierarchyItem &&
    hierarchyItem.type === "layerFolder"
  ) {
    return (
      <LayerFolderEdit
        item={hierarchyItem as TreeNode<"layerFolder">}
        itemId={activeShapeId}
      />
    );
  }

  if (
    activeShapeId !== null &&
    hierarchyItem &&
    hierarchyItem.type === "mutation"
  ) {
    return (
      <MutationEdit
        item={hierarchyItem as TreeNode<"mutation">}
        itemId={activeShapeId}
      />
    );
  }
  return (
    <>
      <Title>No selection</Title>
    </>
  );
};
