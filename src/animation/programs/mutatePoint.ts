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
