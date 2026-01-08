import type React from "react";
import { type TreeItem, type TreeItemIndex } from "react-complex-tree";

import { type NodeType } from "@/dtos/animation-file2.dto";

import { type TreeData } from "./Tree";

export type ToolsProvider = (data: TreeData<NodeType>) => React.ReactNode;

const createTreeNodeData = (
  data: TreeData<NodeType>,
  tools: ToolsProvider
): TreeData<NodeType> => ({
  ...data,
  itemTools: tools(data),
});

type TreeItems = Record<TreeItemIndex, TreeItem<TreeData<NodeType>>>;

export const storyTreeItems: (tools: ToolsProvider) => TreeItems = (tools) => ({
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
