/**
 * Types of nodes in the layer hierarchy
 */
export type NodeType = "layerFolder" | "layer" | "mutation";

/**
 * A node in a hierarchical tree structure
 */
export type TreeNode<Type extends string> = {
  type: Type;
  parentId: string;
  children?: string[];
};

/**
 * The root node of a hierarchy
 */
export type RootNode = {
  type: "root";
  children: string[];
};

/**
 * A hierarchical structure mapping IDs to nodes
 */
export type Hierarchy<Type extends string> = Record<
  string,
  TreeNode<Type> | RootNode
>;
