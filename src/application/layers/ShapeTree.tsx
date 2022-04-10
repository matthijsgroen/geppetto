import { useCallback, useEffect, useMemo, useState } from "react";
import { DraggingPosition } from "react-complex-tree";
import { findParentId, PlacementInfo } from "src/animation/file2/hierarchy";
import { addFolder, addShape, rename } from "../../animation/file2/shapes";
import { GeppettoImage } from "../../animation/file2/types";
import {
  Icon,
  Panel,
  ToolBar,
  ToolButton,
  Tree,
  TreeData,
  TreeItem,
  TreeItemIndex,
  UncontrolledTreeEnvironment,
} from "../../ui-components";
import { useToolAction } from "../hooks/useToolAction";
import { UseState } from "../types";
import { treeDataProvider } from "./TreeDataProvider";

type ShapeTreeProps = {
  fileState: UseState<GeppettoImage>;
};

type LayerItem = TreeItem<TreeData<"layer" | "layerFolder" | "mutation">>;
const yes = () => true;

export const ShapeTree: React.VFC<ShapeTreeProps> = ({ fileState }) => {
  const [fileData, setFileData] = fileState;
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const treeData = useMemo(
    () => treeDataProvider(fileData, { showMutations: false }),
    []
  );
  useEffect(() => {
    treeData.updateActiveTree && treeData.updateActiveTree(fileData);
  }, [fileData]);

  const addShapeAction = useToolAction(() => {
    let position: PlacementInfo | undefined = undefined;
    const targetId = selectedItems[0];
    const folder = fileData.layerFolders[targetId];
    const item = fileData.layers[targetId];
    if (selectedItems.length === 1 && folder) {
      position = { parent: targetId };
      treeData.addChangedId && treeData.addChangedId(targetId);
    }
    if (selectedItems.length === 1 && item) {
      const parentId = findParentId(fileData.layerHierarchy, targetId);
      if (parentId) {
        position = { after: targetId, parent: parentId };
        treeData.addChangedId && treeData.addChangedId(parentId);
      }
    }
    const [updatedImage] = addShape(fileData, "New Shape", position);
    setFileData(updatedImage);
  }, [fileData, selectedItems]);

  const addFolderAction = useToolAction(() => {
    let position: PlacementInfo | undefined = undefined;
    const targetId = selectedItems[0];
    const folder = fileData.layerFolders[targetId];
    const item = fileData.layers[targetId];
    if (selectedItems.length === 1 && folder) {
      position = { parent: targetId };
      treeData.addChangedId && treeData.addChangedId(targetId);
    }
    if (selectedItems.length === 1 && item) {
      const parentId = findParentId(fileData.layerHierarchy, targetId);
      if (parentId) {
        position = { after: targetId, parent: parentId };
        treeData.addChangedId && treeData.addChangedId(parentId);
      }
    }
    const [updatedImage] = addFolder(fileData, "New folder", position);
    setFileData(updatedImage);
  }, [fileData, selectedItems]);

  const onDrop = useCallback((items: LayerItem[], target: DraggingPosition) => {
    console.log("Drop", items, target);
  }, []);

  return (
    <>
      <UncontrolledTreeEnvironment
        dataProvider={treeData}
        onSelectItems={useCallback((items: TreeItemIndex[]) => {
          setSelectedItems(items.map((e) => `${e}`));
        }, [])}
        canRename={true}
        canDrag={yes}
        canDragAndDrop={true}
        canReorderItems={true}
        onRenameItem={useCallback((item: LayerItem, newName: string) => {
          setFileData((fileData) =>
            rename(fileData, `${item.index}`, item.data.type, newName)
          );
        }, [])}
        onDrop={onDrop}
      >
        <ToolBar size="small">
          <ToolButton
            icon={<Icon>📄</Icon>}
            label="+"
            tooltip="Add layer"
            onClick={addShapeAction}
            onKeyDown={addShapeAction}
            disabled={selectedItems.length > 1}
          />
          <ToolButton
            icon={<Icon>📁</Icon>}
            label="+"
            tooltip="Add folder"
            onClick={addFolderAction}
            onKeyDown={addFolderAction}
            disabled={selectedItems.length > 1}
          />
          {/* 
              <ToolButton
                icon={<Icon>📑</Icon>}
                disabled={true}
                tooltip="Copy layer"
              />
              <ToolButton
                icon={<Icon>🗑</Icon>}
                disabled={true}
                tooltip="Remove item"
              />
              <ToolButton
                icon={<Icon>⬆</Icon>}
                disabled={true}
                tooltip="Move item up"
              />
              <ToolButton
                icon={<Icon>⬇</Icon>}
                disabled={true}
                tooltip="Move item down"
              /> */}
        </ToolBar>
        <Panel padding={5}>{<Tree />}</Panel>
      </UncontrolledTreeEnvironment>
    </>
  );
};
