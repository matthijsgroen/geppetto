import { PreparedImageDefinition } from "src/prepareAnimation";
import shader from "./vertexShader-min.vert";

const minOne = (n: number) => Math.max(n, 1);

export const animationVertexShader = (
  animation: PreparedImageDefinition
): string => `
#define MAX_MUT ${minOne(animation.mutators.length)}
#define MAX_IT ${animation.maxIteration}
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
