import { findParentId, PlacementInfo } from "../../animation/file2/hierarchy";
import { addFolder } from "../../animation/file2/shapes";
import {
  Icon,
  Panel,
  ToolBar,
  ToolButton,
  ToolSeparator,
  Tree,
} from "../../ui-components";
import { useFile } from "../applicationMenu/FileContext";
import { useToolAction } from "../hooks/useToolAction";
import { LayerTreeEnvironment } from "../treeEnvironments/LayerTreeEnvironment";
import { UseState } from "../types";
import { ItemEdit } from "./ItemEdit";

type ShapeTreeProps = {
  selectedItemsState: UseState<string[]>;
};

export const ShapeTree: React.FC<ShapeTreeProps> = ({ selectedItemsState }) => {
  const [file, setFile] = useFile();
  const [selectedItems] = selectedItemsState;

  const addFolderAction = useToolAction(() => {
    let position: PlacementInfo | undefined = undefined;
    const targetId = selectedItems[0];
    const folder = file.layerFolders[targetId];
    const item = file.layers[targetId];
    if (selectedItems.length === 1 && folder) {
      position = { parent: targetId };
    }
    if (selectedItems.length === 1 && item) {
      const parentId = findParentId(file.layerHierarchy, targetId);
      if (parentId) {
        position = { after: targetId, parent: parentId };
      }
    }
    const [updatedImage] = addFolder(file, "New folder", position);
    setFile(updatedImage);
  }, [file, selectedItems]);

  // const removeItemAction = useToolAction(() => {
  //   const item = selectedItems[0];
  //   setFileData((value) => removeShape(value, item));
  // }, [fileData, selectedItems]);

  return (
    <LayerTreeEnvironment selectedItemsState={selectedItemsState} showMutations>
      <Panel padding={5}>
        <ToolBar size="small">
          <ToolButton
            icon={<Icon>📁</Icon>}
            label="+"
            tooltip="Add folder"
            onClick={addFolderAction}
            onKeyDown={addFolderAction}
            disabled={selectedItems.length > 1}
          />
          <ToolButton
            icon={<Icon>⚪️</Icon>}
            label="+"
            tooltip="Add mutation"
            disabled
          />
          <ToolSeparator />
          <ToolButton icon={<Icon>🗑</Icon>} disabled tooltip="Remove item" />
        </ToolBar>
        <Tree treeId="composition" />

        <ItemEdit selectedShapeIds={selectedItems} selectedControlIds={[]} />
      </Panel>
    </LayerTreeEnvironment>
  );
};
