import { MutationVector, ShapeDefinition } from "src/lib/types";
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

type TreeConstruct = {
  mutator: number;
  mutationVector: MutationVector;
  shape: ShapeDefinition;
  children: TreeConstruct[];
};

const childrenOf = (node: number): [number, number] => [node * 2, node * 2 + 1];

const findNodeInTree = (
  tree: TreeConstruct[],
  parents: ShapeDefinition[]
): TreeConstruct | undefined => {
  if (tree.length === 0) return undefined;

  const [head, ...tail] = parents;
  if (!head) return undefined;

  const node = tree.find((e) => parents.includes(e.shape));
  if (node) {
    const child = findNodeInTree(node.children, parents);
    if (child) {
      return child;
    } else {
      const child = findNodeInTree(node.children, tail);
      return child ? child : node;
    }
  }
  return undefined;
};

const getNodeIndices = (toDescent: number, current: number): number[] => {
  if (toDescent === 0) {
    return [current];
  }
  const [left, right] = childrenOf(current);
  return ([] as number[]).concat(
    getNodeIndices(toDescent - 1, left),
    getNodeIndices(toDescent - 1, right)
  );
};

const placeItemsInTree = (
  tree: TreeConstruct[],
  binaryTree: Float32Array,
  currentNode: number
) => {
  if (tree.length === 0) {
    return;
  }
  let level = 1;
  while (Math.pow(2, level) < tree.length) {
    level++;
  }
  const nodeIndices = getNodeIndices(level, currentNode);
  tree.forEach((item, index) => {
    const node = nodeIndices[index];
    binaryTree[node] = item.mutator;
    placeItemsInTree(item.children, binaryTree, node);
  });
};

export const createMutationTree = (
  shapes: ShapeDefinition[],
  elements: Element[]
): [string[], Float32Array, Float32Array] => {
  const vectorSettings = new Float32Array(MAX_MUTATION_VECTORS * 4).fill(0);
  const mutators: string[] = [];

  const treeInfo: TreeConstruct[] = [];

  const shapeVectorInfo: { name: string; mutator: number }[] = [];

  const parentIndex: { [name: string]: string[] } = {};

  visitShapes(shapes, (item, parents) => {
    if (isShapeDefinition(item)) {
      const parentNames = parents
        .filter((p) => isShapeDefinition(p))
        .map((e) => e.name)
        .reverse();
      parentIndex[item.name] = parentNames;
    }
    if (isMutationVector(item)) {
      const index = mutators.length;
      mutators.push(item.name);
      vectorSettings[index * 4] = vectorTypeMapping[item.type];
      vectorSettings[index * 4 + 1] = item.origin[0];
      vectorSettings[index * 4 + 2] = item.origin[1];
      if (item.type === "deform") {
        vectorSettings[index * 4 + 3] = item.radius;
      }
      const mutatorParents = parents.filter((p) =>
        isShapeDefinition(p)
      ) as ShapeDefinition[];

      const existingBranch = findNodeInTree(treeInfo, mutatorParents);
      const newNode = {
        mutator: index + 1,
        mutationVector: item,
        shape: [...parents]
          .reverse()
          .find((e) => isShapeDefinition(e)) as ShapeDefinition,
        children: [],
      };

      if (existingBranch) {
        existingBranch.children.push(newNode);
      } else {
        treeInfo.push(newNode);
      }
      shapeVectorInfo.unshift({
        name: newNode.shape.name,
        mutator: newNode.mutator,
      });
    }
    return undefined;
  });

  const treeData = new Float32Array(MAX_TREE_SIZE).fill(0);

  placeItemsInTree(treeInfo, treeData, 1);

  elements.forEach((element) => {
    const node = shapeVectorInfo.find((e) => e.name === element.name);
    if (node) {
      const mutationNodeIndex = treeData.findIndex((e) => e === node.mutator);
      element.mutator = mutationNodeIndex;
    } else {
      const parentNames = parentIndex[element.name];
      parentNames.find((p) => {
        const node = shapeVectorInfo.find((e) => e.name === p);
        if (node) {
          const mutationNodeIndex = treeData.findIndex(
            (e) => e === node.mutator
          );
          element.mutator = mutationNodeIndex;
          return true;
        }
        return false;
      });
    }
  });

  return [mutators, vectorSettings, treeData];
};
