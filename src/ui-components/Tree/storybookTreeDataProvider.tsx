import {
  StaticTreeDataProvider,
  TreeItem,
  TreeItemIndex,
} from "react-complex-tree";
import { NodeType } from "../../animation/file2/types";
import { Icon, ToolButton } from "..";
import { TreeData, TreeDataProvider } from "./Tree";

const treeItems: Record<TreeItemIndex, TreeItem<TreeData<NodeType>>> = {
  root: {
    index: "root",
    canMove: true,
    hasChildren: true,
    children: ["child1", "child2"],
    data: { name: "Root item", icon: "🥕", type: "layerFolder" },
    canRename: true,
  },
  child1: {
    index: "child1",
    canMove: true,
    hasChildren: false,
    children: [],
    data: {
      name: "Child item 1",
      icon: "📄",
      itemTools: <ToolButton size={"small"} icon={<Icon>👁</Icon>} />,
      type: "layer",
    },
    canRename: true,
  },
  child2: {
    index: "child2",
    canMove: true,
    hasChildren: true,
    children: ["child3", "child4"],
    data: {
      name: "Child item 2",
      icon: "📁",
      itemTools: <ToolButton size={"small"} icon={<Icon>👁</Icon>} />,
      type: "layerFolder",
    },
    canRename: true,
  },
  child3: {
    index: "child3",
    canMove: true,
    hasChildren: false,
    data: { name: "Mutation", icon: "🟢", type: "mutation" },
    canRename: true,
  },
  child4: {
    index: "child4",
    canMove: true,
    hasChildren: false,
    data: { name: "Mutation 2", icon: "🔵", type: "mutation" },
    canRename: true,
  },
};

export const storyTreeDataProvider: () => TreeDataProvider<NodeType> = () =>
  new StaticTreeDataProvider(treeItems, (item, newName) => ({
    ...item,
    data: { ...item.data, name: newName },
  }));
