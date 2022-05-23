import { useCallback, useEffect, useMemo } from "react";
import { DraggingPosition } from "react-complex-tree";
import {
  isRootNode,
  moveInHierarchy,
  visit,
} from "../../animation/file2/hierarchy";
import { newFile } from "../../animation/file2/new";
import { rename } from "../../animation/file2/shapes";
import {
  TreeData,
  TreeItem,
  TreeItemIndex,
  UncontrolledTreeEnvironment,
} from "../../ui-components";
import { ActionButton, treeDataProvider } from "./LayerTreeDataProvider";
import { UseState } from "../types";
import { useFile } from "../applicationMenu/FileContext";
import useEvent from "../hooks/useEvent";
import produce from "immer";
import { NodeType } from "../../animation/file2/types";

type LayerTreeEnvironmentProps = {
  selectedItemsState: UseState<string[]>;
  showMutations?: boolean;
  toggleVisibility?: boolean;
  treeId: string;
  children: React.ReactElement | React.ReactElement[] | null;
};

type LayerItem = TreeItem<TreeData<"layer" | "layerFolder" | "mutation">>;
const yes = () => true;

export const LayerTreeEnvironment: React.FC<LayerTreeEnvironmentProps> = ({
  children,
  selectedItemsState,
  treeId,
  showMutations = false,
  toggleVisibility = false,
}) => {
  const [file, setFile] = useFile();
  const [selectedItems, setSelectedItems] = selectedItemsState;

  const actionButtonPress = useEvent(
    (itemId: string, buttonId: ActionButton) => {
      if (buttonId === "visibility") {
        setFile(
          produce((draft) => {
            const item = draft.layerHierarchy[itemId];
            if (item.type === "layer") {
              draft.layers[itemId].visible = !draft.layers[itemId].visible;
            }
            if (item.type === "layerFolder") {
              draft.layerFolders[itemId].visible =
                !draft.layerFolders[itemId].visible;
            }
          })
        );
      }
    }
  );

  const treeData = useMemo(
    () =>
      treeDataProvider(
        newFile(),
        { showMutations, toggleVisibility },
        actionButtonPress
      ),
    [showMutations, toggleVisibility, actionButtonPress]
  );
  useEffect(() => {
    treeData.updateActiveTree && treeData.updateActiveTree(file);
  }, [file, treeData]);

  const canDropAt = useCallback(
    (_items: LayerItem[], target: DraggingPosition) => {
      // target cannot be a layer (only for mutations)
      if (target.targetType === "item") {
        const targetItem = file.layerHierarchy[target.targetItem];
        return targetItem.type === "layerFolder" || targetItem.type === "root";
      }
      return true;
    },
    [file]
  );

  const onDrop = useCallback(
    (items: LayerItem[], target: DraggingPosition) => {
      items.reverse();
      const updatedItems: string[] = [];
      if (target.targetType === "item") {
        const targetId = `${target.targetItem}`;
        updatedItems.push(targetId);
        setFile((fileData) => {
          const result = { ...fileData };
          for (const item of items) {
            if (result.layerHierarchy[item.index].type === "mutation") continue;

            result.layerHierarchy = moveInHierarchy(
              result.layerHierarchy,
              `${item.index}`,
              { parent: targetId }
            );
            const node = fileData.layerHierarchy[`${item.index}`];
            if (!isRootNode(node)) {
              updatedItems.push(node.parentId);
            }
          }
          return result;
        });
      } else {
        setFile((fileData) => {
          const parent = fileData.layerHierarchy[`${target.parentItem}`];
          if (!parent.children) {
            return fileData;
          }
          const childIds = parent.children.filter(
            (id) => fileData.layerHierarchy[id].type !== "mutation"
          );
          const targetId =
            target.linePosition === "bottom"
              ? childIds[target.childIndex - 1]
              : childIds[target.childIndex];

          const result = { ...fileData };
          for (const item of items) {
            if (result.layerHierarchy[item.index].type === "mutation") continue;
            result.layerHierarchy = moveInHierarchy(
              result.layerHierarchy,
              `${item.index}`,
              target.linePosition === "bottom"
                ? { after: targetId }
                : { before: targetId }
            );
            const dest = result.layerHierarchy[`${item.index}`];
            if (!isRootNode(dest)) {
              updatedItems.push(dest.parentId);
            }
            const source = fileData.layerHierarchy[`${item.index}`];
            if (!isRootNode(source)) {
              updatedItems.push(source.parentId);
            }
          }

          return result;
        });
      }
      treeData.addChangedId && treeData.addChangedId(...updatedItems);
    },
    [treeData, setFile]
  );

  const expandedItems = useMemo(() => {
    const expanded: string[] = [];
    visit(file.layerHierarchy, (node, nodeId) => {
      if (node.type === "layerFolder") {
        const folderInfo = file.layerFolders[nodeId];
        if (!folderInfo.collapsed) {
          expanded.push(nodeId);
        }
      }
    });

    return expanded;
  }, [file.layerFolders, file.layerHierarchy]);

  return (
    <UncontrolledTreeEnvironment
      dataProvider={treeData}
      onSelectItems={useCallback(
        (items: TreeItemIndex[]) => {
          const ids = items.map((e) => `${e}`);
          setSelectedItems(ids);
        },
        [setSelectedItems]
      )}
      canRename={true}
      canDrag={yes}
      canDropAt={canDropAt}
      canDragAndDrop={true}
      canReorderItems={true}
      onRenameItem={useEvent((item: LayerItem, newName: string) => {
        setFile((fileData) =>
          rename(fileData, `${item.index}`, item.data.type, newName)
        );
        treeData.addChangedId && treeData.addChangedId(`${item.index}`);
      })}
      onDrop={onDrop}
      onExpandItem={useEvent((item: TreeItem<TreeData<NodeType>>) => {
        setFile(
          produce((draft) => {
            const folder = draft.layerHierarchy[item.index];
            if (folder.type === "layerFolder") {
              draft.layerFolders[item.index].collapsed = false;
            }
          })
        );
      })}
      onCollapseItem={useEvent((item: TreeItem<TreeData<NodeType>>) => {
        setFile(
          produce((draft) => {
            const folder = draft.layerHierarchy[item.index];
            if (folder.type === "layerFolder") {
              draft.layerFolders[item.index].collapsed = true;
            }
          })
        );
      })}
      canDropOnItemWithChildren={true}
      canDropOnItemWithoutChildren={true}
      viewState={{
        [treeId]: {
          expandedItems,
          selectedItems,
        },
      }}
    >
      {children}
    </UncontrolledTreeEnvironment>
  );
};
