import { GeppettoImage, NodeType, TreeNode } from "../../animation/file2/types";
import { Control, ControlPanel, Icon, Title } from "../../ui-components";
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

const LayerEdit: React.FC<EditProps<"layer">> = ({ item, itemId, file }) => {
  const layer = file.layers[itemId];
  return (
    <>
      <Title>
        <Icon>📄</Icon> {layer.name}
      </Title>
      <ControlPanel>
        <Control label="Offset">
          <input type="number" />
        </Control>
        <Control label="Visible">
          <input type="checkbox" />
        </Control>
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
    </>
  );
};
