import { ShapeDefinition, MutationVector, ImageDefinition } from "./types";

export type Visitor = (
  item: ShapeDefinition | MutationVector,
  parents: (ShapeDefinition | MutationVector)[]
) => ShapeDefinition | MutationVector | false | undefined;

interface ItemWithType {
  type: string;
}

export const isShapeDefinition = (
  item: ItemWithType
): item is ShapeDefinition => item.type === "folder" || item.type === "sprite";

export const isMutationVector = (item: ItemWithType): item is MutationVector =>
  item.type === "deform" ||
  item.type === "rotate" ||
  item.type === "translate" ||
  item.type === "stretch";

export const visitVectors = (
  vectors: MutationVector[],
  visitor: Visitor,
  parents: (ShapeDefinition | MutationVector)[] = []
): MutationVector[] =>
  vectors.reduce((result, item) => {
    const visited = visitor(item, parents);
    if (visited === false) {
      return result;
    }
    const newNode =
      (visited && !isMutationVector(visited)) || visited === undefined
        ? item
        : visited;

    return result.concat(newNode);
  }, [] as MutationVector[]);

export const visitShapes = (
  shapes: ShapeDefinition[],
  visitor: Visitor,
  parents: (ShapeDefinition | MutationVector)[] = []
): ShapeDefinition[] =>
  shapes.reduce((result, item) => {
    const visited = visitor(item, parents);
    if (visited === false) {
      return result;
    }
    const newNode =
      (visited && !isShapeDefinition(visited)) || visited === undefined
        ? item
        : visited;

    const updatedChildSprites: ShapeDefinition =
      newNode.type === "folder"
        ? {
            ...newNode,
            mutationVectors: visitVectors(
              newNode.mutationVectors,
              visitor,
              parents.concat(newNode)
            ),
            items: visitShapes(newNode.items, visitor, parents.concat(newNode)),
          }
        : {
            ...newNode,
            mutationVectors: visitVectors(
              newNode.mutationVectors,
              visitor,
              parents.concat(newNode)
            ),
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
