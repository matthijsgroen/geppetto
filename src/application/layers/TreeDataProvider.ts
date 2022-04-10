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
        children: activeTree.layerHierarchy.map((node) => node.id),
        data: { name: "Root item", icon: "🥕", type: "layerFolder" },
        canRename: false,
      };
    }

    const item = findInHierarchy(activeTree.layerHierarchy, itemId);
    if (!item) {
      return {
        index: itemId,
        canMove: false,
        hasChildren: false,
        data: { name: "Not found", icon: "🛑", type: "layer" },
        canRename: true,
      };
    }

    const childIds = (item.children || [])
      .filter((e) => showMutations || e.type !== "mutation")
      .map((node) => node.id);

    if (item.type === "layer") {
      const layerData = activeTree.layers[itemId];
      return {
        index: itemId,
        canMove: false,
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
        canMove: false,
        hasChildren: childIds.length > 0,
        children: childIds,
        data: { name: layerFolderData.name, icon: "📁", type: item.type },
        canRename: true,
      };
    }
    const mutationData = activeTree.mutations[itemId];

    return {
      index: itemId,
      canMove: false,
      hasChildren: childIds.length > 0,
      children: childIds,
      data: {
        name: mutationData.name,
        icon: iconMapping[mutationData.type],
        type: item.type,
      },
      canRename: true,
    };
  };

  let listeners: ((changedItemIds: (string | number)[]) => void)[] = [];

  return {
    updateActiveTree: (tree: GeppettoImage) => {
      const updatedItems: TreeItemIndex[] = ["root"];

      for (const [key, value] of Object.entries(tree.layers)) {
        if (activeTree.layers[key] !== value) {
          updatedItems.push(key);
        }
      }
      for (const [key, value] of Object.entries(tree.layerFolders)) {
        if (activeTree.layerFolders[key] !== value) {
          updatedItems.push(key);
        }
      }
      for (const [key, value] of Object.entries(tree.mutations)) {
        if (activeTree.mutations[key] !== value) {
          updatedItems.push(key);
        }
      }

      activeTree = tree;
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
