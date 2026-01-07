import {
  MutationVector,
  ShapeMutationVector,
  ColorMutationVector,
  ShapeDefinition,
} from "./types";

interface ItemWithType {
  type: string;
}

export const isShapeDefinition = (
  item: ItemWithType
): item is ShapeDefinition => item.type === "folder" || item.type === "sprite";

export const isMutationVector = (item: ItemWithType): item is MutationVector =>
  isShapeVector(item) || isColorVector(item);

const isShapeVector = (item: ItemWithType): item is ShapeMutationVector =>
  item.type === "deform" ||
  item.type === "rotate" ||
  item.type === "translate" ||
  item.type === "stretch" ||
  item.type === "opacity";

const isColorVector = (item: ItemWithType): item is ColorMutationVector =>
  item.type === "lightness" ||
  item.type === "saturation" ||
  item.type === "colorize";

export const visitShapes = (
  shapes: ShapeDefinition[],
  visitor: (
    item: ShapeDefinition | MutationVector,
    parents: (ShapeDefinition | MutationVector)[]
  ) => void,
  parents: (ShapeDefinition | MutationVector)[] = []
): void => {
  for (const shape of shapes) {
    visitor(shape, parents);
    for (const mutator of shape.mutationVectors) {
      visitor(mutator, [...parents, shape]);
    }
    if (shape.type === "folder") {
      visitShapes(shape.items, visitor, [...parents, shape]);
    }
  }
};
