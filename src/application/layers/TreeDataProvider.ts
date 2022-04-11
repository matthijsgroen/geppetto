import { findInHierarchy } from "src/animation/file2/hierarchy";
import {
  GeppettoImage,
  MutationVector,
  NodeType,
} from "src/animation/file2/types";
import {
  TreeDataProvider,
  TreeItem,
  TreeData,
  TreeItemIndex,
} from "../../ui-components/Tree/Tree";

const TREE_ROOT = "root";

export const iconMapping: Record<MutationVector["type"], string> = {
  deform: "🟠",
  rotate: "🔴",
  stretch: "🟣",
  translate: "🟢",
  opacity: "⚪️",
  lightness: "⬜️",
  colorize: "🟧",
  saturation: "🟩",
};

export const treeDataProvider = (
  file: GeppettoImage,
  { showMutations = true } = {}
): TreeDataProvider<NodeType> => {
  let activeTree = file;
  const getItem = (itemId: string | number): TreeItem<TreeData<NodeType>> => {
    if (itemId === TREE_ROOT) {
      return {
        index: TREE_ROOT,
        canMove: false,
        hasChildren: true,
        children: activeTree.layerHierarchy["root"].children,
        data: { name: "Root item", icon: "🥕", type: "layerFolder" },
        canRename: false,
      };
    }

    const item = findInHierarchy(activeTree.layerHierarchy, `${itemId}`);
    if (!item) {
      return {
        index: itemId,
        canMove: false,
        hasChildren: false,
        data: { name: "Not found", icon: "🛑", type: "layer" },
        canRename: true,
      };
    }

    const childIds = (item.children || []).filter(
      (e) => showMutations || activeTree.layerHierarchy[e].type !== "mutation"
    );

    if (item.type === "layer") {
      const layerData = activeTree.layers[itemId];
      return {
        index: itemId,
        canMove: true,
        hasChildren: childIds.length > 0,
        children: childIds,
        data: { name: layerData.name, icon: "📄", type: item.type },
        canRename: true,
      };
    }
    if (item.type === "layerFolder") {
      const layerFolderData = activeTree.layerFolders[itemId];
      return {
        index: itemId,
        canMove: true,
        hasChildren: childIds.length > 0,
        children: childIds,
        data: { name: layerFolderData.name, icon: "📁", type: item.type },
        canRename: true,
      };
    }
    const mutationData = activeTree.mutations[itemId];

    return {
      index: itemId,
      canMove: true,
      hasChildren: childIds.length > 0,
      children: childIds,
      data: {
        name: mutationData.name,
        icon: iconMapping[mutationData.type],
        type: "mutation",
      },
      canRename: true,
    };
  };

  let listeners: ((changedItemIds: TreeItemIndex[]) => void)[] = [];
  let bufferedChanges: TreeItemIndex[] = [];

  return {
    addChangedId: (...ids: string[]) => bufferedChanges.push(...ids),
    updateActiveTree: (tree: GeppettoImage) => {
      const updatedItems: TreeItemIndex[] = ["root", ...bufferedChanges];

      for (const pool of [tree.layers, tree.layerFolders, tree.mutations]) {
        for (const [key, value] of Object.entries(pool)) {
          if (pool[key] !== value) {
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
