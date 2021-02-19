export const MAX_MUTATION_VECTORS = 20;
export const MAX_TREE_SIZE = 128;

export const vectorTypeMapping = {
  translate: 1,
  stretch: 2,
  rotate: 3,
  deform: 4,
};

export const mutationShader = `
  uniform float mutation; 

  // x = type, yz = origin, a = radius
  uniform vec4 uMutationVectors[${MAX_MUTATION_VECTORS}];
  uniform vec2 uMutationValues[${MAX_MUTATION_VECTORS}];
  uniform float uMutationTree[${MAX_TREE_SIZE}];

  vec2 mutatePoint(vec2 startValue, int treeIndex) {
    if (treeIndex == 0) {
      return startValue;
    }
    int mutationIndex = int(uMutationTree[treeIndex]);
    if (mutationIndex == 0) {
      // TODO, iterate higher into tree until treeIndex == 0
      return startValue;
    }
    vec4 mutation = uMutationVectors[mutationIndex - 1];
    vec2 mutationValue = uMutationValues[mutationIndex - 1];
    int mutationType = int(mutation.x);

    if (mutationType == 1) { // Translate
      return startValue + mutationValue;
    }

    if (mutationType == 2) { // Translate
      vec2 origin = mutation.yz;
      return origin + vec2(
        (startValue.x - origin.x) * mutationValue.x, 
        (startValue.y - origin.y) * mutationValue.y
      );
    }

    return startValue;
  }
`;
