import { Vec2, Vec4 } from "../../../types";
import {
  GeppettoImage,
  Layer,
  MutationVector,
} from "../../../animation/file2/types";
import { getPreviousOfType, visit } from "../../../animation/file2/hierarchy";

export const MAX_MUTATION_VECTORS = 60;

export const getAnchor = (sprite: Layer): Vec2 => {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  sprite.points.forEach(([x, y]) => {
    minX = x < minX ? x : minX;
    maxX = x > maxX ? x : maxX;
    minY = y < minY ? y : minY;
    maxY = y > maxY ? y : maxY;
  });

  return [(minX + maxX) / 2, (minY + maxY) / 2];
};

export const vectorTypeMapping: Record<MutationVector["type"], number> = {
  translate: 1,
  stretch: 2,
  rotate: 3,
  deform: 4,
  opacity: 5,
  lightness: 6,
  colorize: 7,
  saturation: 8,
};

const mutatorToVec4 = (mutator: MutationVector): Vec4 => [
  vectorTypeMapping[mutator.type],
  mutator.origin[0],
  mutator.origin[1],
  mutator.type === "deform" || mutator.type === "translate"
    ? mutator.radius
    : -1,
];

export const createShapeMutationList = (
  shapes: GeppettoImage
): {
  parentList: Float32Array;
  vectorSettings: Vec4[];
  shapeMutatorMapping: Record<string, number>;
  mutatorMapping: Record<string, number>;
} => {
  const mutatorIndices: { id: string; index: number; parent: number }[] = [];
  const mutators: Vec4[] = [];

  const mutatorMapping: Record<string, number> = {};
  const layerHierarchy = shapes.layerHierarchy;

  visit(layerHierarchy, (item, itemId) => {
    if (item.type === "mutation") {
      const mutation = shapes.mutations[itemId];
      const value = mutatorToVec4(mutation);
      const index = mutators.length;
      mutators.push(value);

      const parentMutation = getPreviousOfType(
        layerHierarchy,
        "mutation",
        itemId
      );
      const mutatorIndex =
        parentMutation === null
          ? -1
          : mutatorIndices.findIndex((e) => e.id === parentMutation);
      mutatorIndices.push({ id: itemId, index, parent: mutatorIndex });
      mutatorMapping[itemId] = mutatorIndex;
    }
  });

  const shapeMutatorMapping: Record<string, number> = {};
  visit(layerHierarchy, (item, itemId) => {
    if (item.type === "layer") {
      const parentMutation = getPreviousOfType(
        layerHierarchy,
        "mutation",
        itemId
      );
      const mutatorIndex =
        parentMutation === null
          ? -1
          : mutatorIndices.findIndex((e) => e.id === parentMutation);
      shapeMutatorMapping[itemId] = mutatorIndex;
    }
  });

  const parentList = new Float32Array(mutators.length);

  mutatorIndices.forEach((item, index) => {
    parentList[index] = item.parent;
  });

  return {
    mutatorMapping,
    parentList,
    vectorSettings: mutators,
    shapeMutatorMapping,
  };
};
