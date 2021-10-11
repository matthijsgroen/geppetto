import {
  MutationVector,
  MutationVectorTypes,
  ShapeDefinition,
  Vec4,
} from "src/lib/types";
import {
  isShapeDefinition,
  isMutationVector,
  visitShapes,
} from "src/lib/visit";

export const MAX_MUTATION_VECTORS = 60;
export const MAX_CONTROLS = 20;
export const MAX_MUTATION_CONTROL_VECTORS = 120;

export const vectorTypeMapping: Record<MutationVectorTypes, number> = {
  translate: 1,
  stretch: 2,
  rotate: 3,
  deform: 4,
  opacity: 5,
  lightness: 6,
  colorize: 7,
  saturation: 8,
};

export const mutationValueShader = `
  uniform vec2 uMutationValues[${MAX_MUTATION_VECTORS}];

  vec2 getMutationValue(int mutationIndex, int mutationType) {
    return uMutationValues[mutationIndex];
  }
`;

export const mutationShader = `
  #define PI_FRAC 0.017453292519943295

  // x = type, yz = origin, a = radius
  uniform vec4 uMutationVectors[${MAX_MUTATION_VECTORS}];
  uniform int uMutationParent[${MAX_MUTATION_VECTORS}];

  mat3 mutateOnce(mat3 startValue, int mutationIndex) {
    vec4 mutation = uMutationVectors[mutationIndex];
    int mutationType = int(mutation.x);

    vec2 mutationValue = getMutationValue(mutationIndex, mutationType);
    vec2 origin = mutation.yz;

    vec3 result = startValue[0];
    vec3 color = startValue[1];
    vec3 effect = startValue[2];

    if (mutationType == 1) { // Translate
      float effect = 1.0;
      if (mutation.a > 0.0 && distance(result.xy, origin) > mutation.a) {
        effect = 0.0;
      }
      result = vec3(result.xy + mutationValue * effect, result.z);
    }

    if (mutationType == 2) { // Stretch
      result = vec3(origin.xy + vec2(
        (result.x - origin.x) * mutationValue.x,
        (result.y - origin.y) * mutationValue.y
      ), result.z);
    }

    if (mutationType == 3) { // Rotation
      float rotation = mutationValue.x * PI_FRAC;
      mat2 entityRotationMatrix = mat2(cos(rotation), sin(rotation), -sin(rotation), cos(rotation));
      result = vec3((result.xy - origin) * entityRotationMatrix + origin, result.z);
    }

    if (mutationType == 4) { // Deform
      float effect = 1.0 - clamp(distance(result.xy, origin), 0.0, mutation.a) / mutation.a;
      result = vec3(result.xy + mutationValue * effect, result.z);
    }

    if (mutationType == 5) { // Opacity
      result = vec3(result.xy, result.z * mutationValue.x);
    }

    if (mutationType == 6) { // Lightness
      color = vec3(mutationValue.x * color.x, color.yz);
    }

    if (mutationType == 7) { // Colorize setting
      effect = vec3(mutationValue.xy, effect.z);
    }

    if (mutationType == 8) { // Saturation
      color = vec3(color.x, mutationValue.x * color.y, color.z);
    }

    return mat3(
      result,
      color,
      effect
    );
  }

  mat3 mutatePoint(mat3 startValue, int mutationIndex) {
    int currentNode = mutationIndex;
    mat3 result = startValue;

    for(int i = 0; i < ${MAX_MUTATION_VECTORS}; i++) {
        if (currentNode == -1) {
            return result;
        }
        result = mutateOnce(result, currentNode);
        currentNode = uMutationParent[currentNode];
    }
    return result;
  }

`;

const mutatorToVec4 = (mutator: MutationVector): Vec4 => [
  vectorTypeMapping[mutator.type],
  mutator.origin[0],
  mutator.origin[1],
  mutator.type === "deform" || mutator.type === "translate"
    ? mutator.radius
    : -1,
];

const getParentMutation = (
  parents: (ShapeDefinition | MutationVector)[],
  self?: MutationVector
): MutationVector | null => {
  const parentShape = parents[parents.length - 1];
  if (isShapeDefinition(parentShape)) {
    const mutatorIndex = self ? parentShape.mutationVectors.indexOf(self) : -1;
    if (mutatorIndex > 0) {
      return parentShape.mutationVectors[mutatorIndex - 1];
    }
    for (let i = parents.length - (self ? 2 : 1); i >= 0; i--) {
      const shape = parents[i];
      if (
        shape &&
        isShapeDefinition(shape) &&
        shape.mutationVectors.length > 0
      ) {
        return shape.mutationVectors[shape.mutationVectors.length - 1];
      }
    }
  }
  return null;
};

export const createShapeMutationList = (
  shapes: ShapeDefinition[]
): {
  parentList: Float32Array;
  vectorSettings: Vec4[];
  shapeMutatorMapping: Record<string, number>;
  mutatorMapping: Record<string, number>;
} => {
  const mutatorIndices: { name: string; index: number; parent: number }[] = [];
  const mutators: Vec4[] = [];

  const mutatorMapping: Record<string, number> = {};

  visitShapes(shapes, (item, parents) => {
    if (isMutationVector(item)) {
      const value = mutatorToVec4(item);
      const index = mutators.length;
      mutators.push(value);

      const parentMutation = getParentMutation(parents, item);
      const mutatorIndex =
        parentMutation === null
          ? -1
          : mutatorIndices.findIndex((e) => e.name === parentMutation.name);
      mutatorIndices.push({ name: item.name, index, parent: mutatorIndex });
      mutatorMapping[item.name] = mutatorIndex;
    }
    return undefined;
  });

  const shapeMutatorMapping: Record<string, number> = {};
  visitShapes(shapes, (item, parents) => {
    if (isShapeDefinition(item)) {
      const parentMutation = getParentMutation(parents.concat(item));
      const mutatorIndex =
        parentMutation === null
          ? -1
          : mutatorIndices.findIndex((e) => e.name === parentMutation.name);
      shapeMutatorMapping[item.name] = mutatorIndex;
    }
    return undefined;
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
