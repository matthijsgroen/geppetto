import { iconMapping } from "../../animation/file2/mutation";
import { GeppettoImage, NodeType, TreeNode } from "../../animation/file2/types";
import { Control, ControlPanel, Icon, Title } from "../../ui-components";
import { VectorControl } from "../controls/VectorControl";
import { UpdateState } from "../types";

type ItemEditProps = {
  selectedShapeIds: string[];
  selectedControlIds: string[];
  file: GeppettoImage;
  setFile: UpdateState<GeppettoImage>;
};

type EditProps<T extends NodeType> = {
  item: TreeNode<T>;
  itemId: string;
  file: GeppettoImage;
  setFile: UpdateState<GeppettoImage>;
};

const LayerEdit: React.FC<EditProps<"layer">> = ({ itemId, file }) => {
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

const MutationEdit: React.FC<EditProps<"mutation">> = ({ itemId, file }) => {
  const mutation = file.mutations[itemId];
  return (
    <>
      <Title>
        <Icon>{iconMapping[mutation.type]}</Icon> {mutation.name}
      </Title>
      <ControlPanel>
        <VectorControl label="Origin" value={mutation.origin} />
      </ControlPanel>
    </>
  );
};

export const ItemEdit: React.FC<ItemEditProps> = ({
  selectedShapeIds,
  selectedControlIds,
  file,
  setFile,
}) => {
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
            file={file}
            setFile={setFile}
          />
        )}
      {activeShapeId !== null &&
        hierarchyItem &&
        hierarchyItem.type === "mutation" && (
          <MutationEdit
            item={hierarchyItem as TreeNode<"mutation">}
            itemId={activeShapeId}
            file={file}
            setFile={setFile}
          />
        )}
    </>
  );
};
