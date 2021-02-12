import { ShapeDefinition, MutationVector, ImageDefinition } from "./types";

export type Visitor = (
  item: ShapeDefinition | MutationVector
) => ShapeDefinition | MutationVector | false | undefined;

interface ItemWithType {
  type: string;
}

export const isShapeDefintion = (item: ItemWithType): item is ShapeDefinition =>
  item.type === "folder" || item.type === "sprite";

export const isMutationVector = (item: ItemWithType): item is MutationVector =>
  item.type === "deform" ||
  item.type === "rotate" ||
  item.type === "translate" ||
  item.type === "stretch";

const visitVectors = (
  vectors: MutationVector[],
  visitor: Visitor
): MutationVector[] =>
  vectors.reduce((result, item) => {
    const visited = visitor(item);
    if (visited === false) {
      return result;
    }
    const newNode =
      (visited && !isMutationVector(visited)) || visited === undefined
        ? item
        : visited;

    return result.concat(newNode);
  }, [] as MutationVector[]);

const visitShapes = (
  shapes: ShapeDefinition[],
  visitor: Visitor
): ShapeDefinition[] =>
  shapes.reduce((result, item) => {
    const visited = visitor(item);
    if (visited === false) {
      return result;
    }
    const newNode =
      (visited && !isShapeDefintion(visited)) || visited === undefined
        ? item
        : visited;

    const updatedChildSprites: ShapeDefinition =
      newNode.type === "folder"
        ? {
            ...newNode,
            items: visitShapes(newNode.items, visitor),
            mutationVectors: visitVectors(newNode.mutationVectors, visitor),
          }
        : {
            ...newNode,
            mutationVectors: visitVectors(newNode.mutationVectors, visitor),
          };

    return result.concat(updatedChildSprites);
  }, [] as ShapeDefinition[]);

export const visit = (
  imageDefinition: ImageDefinition,
  visitor: Visitor
): ImageDefinition => {
  return {
    ...imageDefinition,
    shapes: visitShapes(imageDefinition.shapes, visitor),
  };
};
