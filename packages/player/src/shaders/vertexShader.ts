import type { PreparedImageDefinition } from "../types";
import shader from "./vertexShader-min.vert";

const minOne = (n: number) => Math.max(n, 1);

// Calculate max iteration from control mutation indices
const getMaxIteration = (animation: PreparedImageDefinition): number => {
  let maxIteration = 0;
  for (let i = 0; i < animation.controlMutationIndices.length; i++) {
    const data = animation.controlMutationIndices.data;
    const itemCount = data[i * 2 + 1];
    maxIteration = Math.max(maxIteration, itemCount);
  }
  return maxIteration;
};

export const animationVertexShader = (
  animation: PreparedImageDefinition
): string => `
#define MAX_MUT ${minOne(animation.mutators.length)}
#define MAX_IT ${getMaxIteration(animation)}
uniform vec2 uControlMutValues[${minOne(
  animation.controlMutationValues.length
)}];
uniform vec3 uMutValueIndices[${minOne(animation.mutationValueIndices.length)}];
uniform vec2 uControlMutIndices[${minOne(
  animation.controlMutationIndices.length
)}];
uniform float uControlValues[${minOne(animation.controls.length)}];
${shader}
`;
