import {
  StaticTreeDataProvider,
  TreeItem,
  TreeItemIndex,
} from "react-complex-tree";
import { NodeType } from "../../animation/file2/types";
import { TreeData, TreeDataProvider } from "./Tree";
import React from "react";

export type ToolsProvider = (data: TreeData<NodeType>) => React.ReactNode;

const createTreeNodeData = (
  data: TreeData<NodeType>,
  tools: ToolsProvider
): TreeData<NodeType> => ({
  ...data,
  itemTools: tools(data),
});

const treeItems: (
  tools: ToolsProvider
) => Record<TreeItemIndex, TreeItem<TreeData<NodeType>>> = (tools) => ({
  root: {
    index: "root",
    canMove: true,
    hasChildren: true,
    children: ["child1", "child2"],
    data: createTreeNodeData(
      { name: "Root item", icon: "🥕", type: "layerFolder" },
      tools
    ),
    canRename: true,
  },
  child1: {
    index: "child1",
    canMove: true,
    hasChildren: false,
    children: [],
    data: createTreeNodeData(
      {
        name: "Child item 1",
        icon: "📄",
        type: "layer",
      },
      tools
    ),
    canRename: true,
  },
  child2: {
    index: "child2",
    canMove: true,
    hasChildren: true,
    children: ["child3", "child4"],
    data: createTreeNodeData(
      {
        name: "Child item 2",
        icon: "📁",
        type: "layerFolder",
      },
      tools
    ),
    canRename: true,
  },
  child3: {
    index: "child3",
    canMove: true,
    hasChildren: false,
    data: createTreeNodeData(
      { name: "Mutation", icon: "🟢", type: "mutation" },
      tools
    ),
    canRename: true,
  },
  child4: {
    index: "child4",
    canMove: true,
    hasChildren: false,
    data: createTreeNodeData(
      { name: "Mutation 2", icon: "🔵", type: "mutation" },
      tools
    ),
    canRename: true,
  },
});

export const storyTreeDataProvider: (
  tools: ToolsProvider
) => TreeDataProvider<NodeType> = (tools) =>
  new StaticTreeDataProvider(treeItems(tools), (item, newName) => ({
    ...item,
    data: { ...item.data, name: newName },
  }));
