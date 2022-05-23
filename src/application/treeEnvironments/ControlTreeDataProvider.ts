import { findInHierarchy } from "../../animation/file2/hierarchy";
import { GeppettoImage } from "../../animation/file2/types";
import {
  TreeDataProvider,
  TreeItem,
  TreeData,
  TreeItemIndex,
} from "../../ui-components/Tree/Tree";

const TREE_ROOT = "root";

type ControlType = "control" | "controlFolder";

export const treeDataProvider = (
  file: GeppettoImage
): TreeDataProvider<ControlType> => {
  let activeTree = file;
  const getItem = (
    itemId: string | number
  ): TreeItem<TreeData<ControlType>> => {
    if (itemId === TREE_ROOT) {
      return {
        index: TREE_ROOT,
        canMove: false,
        hasChildren: true,
        children: activeTree.controlHierarchy["root"].children,
        data: { name: "Root item", icon: "🥕", type: "controlFolder" },
        canRename: false,
      };
    }

    const item = findInHierarchy(activeTree.controlHierarchy, `${itemId}`);
    if (!item) {
      return {
        index: itemId,
        canMove: false,
        hasChildren: false,
        data: { name: "Not found", icon: "🛑", type: "control" },
        canRename: true,
      };
    }

    const childIds = item.children || [];

    if (item.type === "control") {
      const controlData = activeTree.controls[itemId];
      return {
        index: itemId,
        canMove: true,
        hasChildren: childIds.length > 0,
        children: childIds,
        data: { name: controlData.name, icon: "⚙️", type: item.type },
        canRename: true,
      };
    }
    const controlFolderData = activeTree.controlFolders[itemId];
    return {
      index: itemId,
      canMove: true,
      hasChildren: childIds.length > 0,
      children: childIds,
      data: { name: controlFolderData.name, icon: "📁", type: "controlFolder" },
      canRename: true,
    };
  };

  let listeners: ((changedItemIds: TreeItemIndex[]) => void)[] = [];
  let bufferedChanges: TreeItemIndex[] = [];

  return {
    addChangedId: (...ids: string[]) => bufferedChanges.push(...ids),
    updateActiveTree: (tree: GeppettoImage) => {
      const updatedItems: TreeItemIndex[] = ["root", ...bufferedChanges];
      const pools = ["controls", "controlFolders", "controlHierarchy"] as const;

      for (const pool of pools) {
        for (const [key, value] of Object.entries(activeTree[pool])) {
          const newNode = tree[pool][key];
          if (newNode !== value && newNode) {
            updatedItems.push(key);
          }
        }
      }

      activeTree = tree;
      bufferedChanges = [];
      listeners.forEach((l) => {
        l(updatedItems);
      });
    },
    getTreeItem: async (itemId) => getItem(itemId),
    getTreeItems: async (itemIds) => itemIds.map((id) => getItem(id)),
    onDidChangeTreeData: (listener) => {
      listeners = listeners.concat(listener);
      return {
        dispose: () => {
          listeners = listeners.filter((l) => l !== listener);
        },
      };
    },
  };
};
