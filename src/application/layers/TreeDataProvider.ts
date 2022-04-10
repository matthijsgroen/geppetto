import { findInHierarchy } from "src/animation/file2/hierarchy";
import { GeppettoImage, MutationVector } from "src/animation/file2/types";
import { TreeDataProvider } from "../../ui-components/Tree/Tree";

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
): TreeDataProvider => {
  let activeTree = file;
  const getItem = (itemId: string | number) => {
    if (itemId === TREE_ROOT) {
      return {
        index: TREE_ROOT,
        canMove: false,
        hasChildren: true,
        children: activeTree.layerHierarchy.map((node) => node.id),
        data: { name: "Root item", icon: "🥕" },
        canRename: false,
      };
    }

    const item = findInHierarchy(activeTree.layerHierarchy, itemId);
    if (!item) {
      return {
        index: itemId,
        canMove: false,
        hasChildren: false,
        data: { name: "Not found", icon: "🛑" },
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
        data: { name: layerData.name, icon: "📄" },
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
        data: { name: layerFolderData.name, icon: "📁" },
        canRename: true,
      };
    }
    const mutationData = activeTree.mutations[itemId];

    return {
      index: itemId,
      canMove: false,
      hasChildren: childIds.length > 0,
      children: childIds,
      data: { name: mutationData.name, icon: iconMapping[mutationData.type] },
      canRename: true,
    };
  };

  let listeners: ((changedItemIds: (string | number)[]) => void)[] = [];

  return {
    updateActiveTree: (tree: GeppettoImage) => {
      activeTree = tree;
      listeners.forEach((l) => {
        l(["root"]);
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
