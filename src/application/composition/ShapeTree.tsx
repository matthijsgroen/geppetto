import { findParentId, PlacementInfo } from "../../animation/file2/hierarchy";
import { addFolder } from "../../animation/file2/shapes";
import { GeppettoImage } from "../../animation/file2/types";
import {
  Icon,
  Panel,
  ToolBar,
  ToolButton,
  ToolSeparator,
  Tree,
} from "../../ui-components";
import { useToolAction } from "../hooks/useToolAction";
import { LayerTreeEnvironment } from "../treeEnvironments/LayerTreeEnvironment";
import { UseState } from "../types";

type ShapeTreeProps = {
  fileState: UseState<GeppettoImage>;
  selectedItemsState: UseState<string[]>;
};

export const ShapeTree: React.FC<ShapeTreeProps> = ({
  fileState,
  selectedItemsState,
}) => {
  const [fileData, setFileData] = fileState;
  const [selectedItems] = selectedItemsState;

  const addFolderAction = useToolAction(() => {
    let position: PlacementInfo | undefined = undefined;
    const targetId = selectedItems[0];
    const folder = fileData.layerFolders[targetId];
    const item = fileData.layers[targetId];
    if (selectedItems.length === 1 && folder) {
      position = { parent: targetId };
    }
    if (selectedItems.length === 1 && item) {
      const parentId = findParentId(fileData.layerHierarchy, targetId);
      if (parentId) {
        position = { after: targetId, parent: parentId };
      }
    }
    const [updatedImage] = addFolder(fileData, "New folder", position);
    setFileData(updatedImage);
  }, [fileData, selectedItems]);

  // const removeItemAction = useToolAction(() => {
  //   const item = selectedItems[0];
  //   setFileData((value) => removeShape(value, item));
  // }, [fileData, selectedItems]);

  return (
    <LayerTreeEnvironment
      fileState={fileState}
      selectedItemsState={selectedItemsState}
      showMutations
    >
      <ToolBar size="small">
        <ToolButton
          icon={<Icon>📁</Icon>}
          label="+"
          tooltip="Add folder"
          onClick={addFolderAction}
          onKeyDown={addFolderAction}
          disabled={selectedItems.length > 1}
        />
        <ToolSeparator />
      </ToolBar>
      <Panel padding={5}>{<Tree treeId="composition" />}</Panel>
    </LayerTreeEnvironment>
  );
};
