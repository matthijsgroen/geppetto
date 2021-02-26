import { ShapeDefinition } from "src/lib/types";
import {
  isMutationVector,
  isShapeDefinition,
  visitShapes,
} from "src/lib/visit";

export const MAX_MUTATION_VECTORS = 20;
export const MAX_TREE_LEVELS = 7;
export const MAX_TREE_SIZE = Math.pow(2, MAX_TREE_LEVELS);

export const vectorTypeMapping = {
  translate: 1,
  stretch: 2,
  rotate: 3,
  deform: 4,
};

export const mutationShader = `
  #define PI_FRAC 0.017453292519943295
  uniform float mutation; 

  // x = type, yz = origin, a = radius
  uniform vec4 uMutationVectors[${MAX_MUTATION_VECTORS}];
  uniform vec2 uMutationValues[${MAX_MUTATION_VECTORS}];
  uniform float uMutationTree[${MAX_TREE_SIZE}];

  vec2 mutateOnce(vec2 startValue, int treeIndex) {
    if (treeIndex == 0) {
      return startValue;
    }
    int mutationIndex = int(uMutationTree[treeIndex]);
    if (mutationIndex == 0) {
      return startValue;
    }
    vec4 mutation = uMutationVectors[mutationIndex - 1];
    vec2 mutationValue = uMutationValues[mutationIndex - 1];
    int mutationType = int(mutation.x);
    vec2 origin = mutation.yz;

    vec2 result = startValue;

    if (mutationType == 1) { // Translate
      result = startValue + mutationValue;
    }

    if (mutationType == 2) { // Stretch
      result = origin + vec2(
        (startValue.x - origin.x) * mutationValue.x, 
        (startValue.y - origin.y) * mutationValue.y
      );
    }

    if (mutationType == 3) { // Rotation
      float rotation = mutationValue.x * PI_FRAC;
      mat2 entityRotationMatrix = mat2(cos(rotation), sin(rotation), -sin(rotation), cos(rotation));
      result = (startValue - origin) * entityRotationMatrix + origin;
    }

    if (mutationType == 4) { // Deform
      float effect = 1.0 - clamp(distance(startValue, origin), 0.0, mutation.a) / mutation.a;	
      result = startValue + mutationValue * effect;	
    }

    return result;
  }


  vec2 mutatePoint(vec2 startValue, int treeIndex) {
    int currentNode = treeIndex;
    vec2 result = startValue;

    for(int i = 0; i < ${MAX_TREE_LEVELS}; i++) {
        if (currentNode == 0) {
            return result;
        }
        result = mutateOnce(result, currentNode);
        currentNode /= 2;
    }
    return result;
  }

`;

export interface Element {
  name: string;
  mutator: number;
}

export const createMutationTree = (
  shapes: ShapeDefinition[],
  elements: Element[]
): [string[], Float32Array, Float32Array] => {
  const vectorSettings = new Float32Array(MAX_MUTATION_VECTORS * 4).fill(0);
  const mutators: string[] = [];

  const treeInfo: { mutator: number; shape: ShapeDefinition }[][] = [];

  visitShapes(shapes, (item, parents) => {
    if (isMutationVector(item)) {
      const index = mutators.length;
      mutators.push(item.name);
      vectorSettings[index * 4] = vectorTypeMapping[item.type];
      vectorSettings[index * 4 + 1] = item.origin[0];
      vectorSettings[index * 4 + 2] = item.origin[1];
      if (item.type === "deform") {
        vectorSettings[index * 4 + 3] = item.radius;
      }

      const existingBranch = treeInfo.find((branch) =>
        branch.find((node) => parents.includes(node.shape))
      );
      if (existingBranch) {
        existingBranch.push({
          mutator: index + 1,
          shape: [...parents]
            .reverse()
            .find((e) => isShapeDefinition(e)) as ShapeDefinition,
        });
      } else {
        treeInfo.push([
          {
            mutator: index + 1,
            shape: [...parents]
              .reverse()
              .find((e) => isShapeDefinition(e)) as ShapeDefinition,
          },
        ]);
      }
    }
    return undefined;
  });

  let level = 1;
  while (Math.pow(2, level) < treeInfo.length) {
    level++;
  }

  const childrenOf = (node: number): [number, number] => [
    node * 2,
    node * 2 + 1,
  ];

  const treeData = new Float32Array(MAX_TREE_SIZE).fill(0);
  const startElement = Math.pow(2, level);

  if (mutators.length >= MAX_MUTATION_VECTORS) {
    throw new Error("More vectors than shader permits");
  }

  treeInfo.forEach((vectors, index) => {
    let nodeIndex = startElement + index;
    vectors.forEach((item, branchIndex) => {
      if (branchIndex > 0) {
        nodeIndex = childrenOf(nodeIndex)[0];
      }
      treeData[nodeIndex] = item.mutator;
      elements.forEach((e) => {
        if (
          (e.name === item.shape.name ||
            (item.shape.type === "folder" &&
              item.shape.items.find(
                (c) => c.type === "sprite" && c.name === e.name
              ))) &&
          e.mutator < nodeIndex
        ) {
          e.mutator = nodeIndex;
        }
      });
    });
  });

  return [mutators, vectorSettings, treeData];
};
