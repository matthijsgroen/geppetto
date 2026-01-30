import { geppettoImageSchema } from "./schemas";
import { type GeppettoImage } from "./image";
import {
  type MutationVector,
  type ShapeMutationVector,
  type ColorMutationVector,
} from "./mutations";
import { type TreeNode, type RootNode, type NodeType } from "./hierarchy";
import {
  type AnimationTrack,
  type AnimationControlTrack,
  type AnimationVisibilityTrack,
} from "./animations";
import { ZodError } from "zod";

export type GeppettoImageParseError = ZodError<GeppettoImage>;

/**
 * Type guard to check if a file is format 2.x using Zod validation
 */
export const isFormat2File = (
  file: unknown,
  onError?: (error: GeppettoImageParseError) => void
): file is GeppettoImage => {
  const result = geppettoImageSchema.safeParse(file);
  if (!result.success) {
    onError?.(result.error);
  }
  return result.success;
};

/**
 * Type guard to check if a mutation is a shape mutation
 */
export const isShapeMutationVector = (
  vector: MutationVector
): vector is ShapeMutationVector =>
  vector.type === "deform" ||
  vector.type === "opacity" ||
  vector.type === "rotate" ||
  vector.type === "stretch" ||
  vector.type === "translate";

/**
 * Type guard to check if a mutation is a color mutation
 */
export const isColorMutationVector = (
  vector: MutationVector
): vector is ColorMutationVector =>
  vector.type === "lightness" ||
  vector.type === "saturation" ||
  vector.type === "colorize";

/**
 * Type guard to check if a node is a TreeNode (not RootNode)
 */
export const isTreeNode = <Type extends string>(
  node: TreeNode<Type> | RootNode
): node is TreeNode<Type> => "parentId" in node;

/**
 * Type guard to check if a node is a RootNode
 */
export const isRootNode = <Type extends string>(
  node: TreeNode<Type> | RootNode
): node is RootNode => node.type === "root";

/**
 * Type guard to check if a node is a layer node
 */
export const isLayerNode = (
  node: TreeNode<NodeType> | RootNode
): node is TreeNode<NodeType> & { type: "layer" } =>
  isTreeNode(node) && node.type === "layer";

/**
 * Type guard to check if a node is a layer folder node
 */
export const isLayerFolderNode = (
  node: TreeNode<NodeType> | RootNode
): node is TreeNode<NodeType> & { type: "layerFolder" } =>
  isTreeNode(node) && node.type === "layerFolder";

/**
 * Type guard to check if a node is a mutation node
 */
export const isMutationNode = (
  node: TreeNode<NodeType> | RootNode
): node is TreeNode<NodeType> & { type: "mutation" } =>
  isTreeNode(node) && node.type === "mutation";

/**
 * Type guard to check if an animation track is a control track
 */
export const isControlTrack = (
  track: AnimationTrack
): track is AnimationControlTrack => track.type === "control";

/**
 * Type guard to check if an animation track is a visibility track
 */
export const isVisibilityTrack = (
  track: AnimationTrack
): track is AnimationVisibilityTrack => track.type === "visibility";
