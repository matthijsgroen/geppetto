import { getPreviousOfType } from "../../../animation/file2/hierarchy";
import { GeppettoImage, MutationVector } from "../../../animation/file2/types";
import { Vec2 } from "../../../types";
import {
  distance,
  mergeMutationValue,
  mixHueVec2,
  mixVec2,
  vecAdd,
  vecMul,
  vecSub,
} from "./vertices";

type VectorValues = GeppettoImage["defaultFrame"];

export const calculateVectorValues = (
  file: GeppettoImage,
  mutationValues: GeppettoImage["defaultFrame"],
  controlValues: GeppettoImage["controlValues"]
): VectorValues => {
  const result: VectorValues = { ...mutationValues };
  for (const [controlId, controlValue] of Object.entries(controlValues)) {
    const controlInfo = file.controls[controlId];
    if (!controlInfo) continue;
    const minStep = Math.floor(controlValue);
    const maxStep = Math.ceil(controlValue);

    const minValue = controlInfo.steps[minStep];
    const maxValue = controlInfo.steps[maxStep];

    const mixValue = controlValue - minStep;

    for (const [mutationId, mutationValue] of Object.entries(minValue)) {
      const mutationInfo = file.mutations[mutationId];
      const value =
        mutationInfo.type === "colorize"
          ? mixHueVec2(mutationValue, maxValue[mutationId], mixValue)
          : mixVec2(mutationValue, maxValue[mutationId], mixValue);

      if (result[mutationId]) {
        result[mutationId] = mergeMutationValue(
          value,
          result[mutationId],
          mutationInfo.type
        );
      } else {
        result[mutationId] = value;
      }
    }
  }

  return result;
};

const inRadius = (start: Vec2, affected: Vec2, radius: number): boolean =>
  distance(affected, start) < radius;

const applyMutation = (
  value: Vec2,
  mutation: MutationVector,
  mutationValue: Vec2
): Vec2 => {
  if (mutation === undefined) {
    // values or info could be lagging behind
    return value;
  }
  let newValue = value;
  if (mutation.type === "translate") {
    const mutatorOrigin = mutation.origin;
    if (
      mutation.radius === -1 ||
      inRadius(mutatorOrigin, newValue, mutation.radius)
    ) {
      newValue = vecAdd(newValue, mutationValue);
    }
  }

  if (mutation.type === "stretch") {
    const mutatorOrigin = mutation.origin;
    const point = vecSub(newValue, mutatorOrigin);
    const stretched: Vec2 = vecMul(point, mutationValue);

    newValue = vecAdd(mutatorOrigin, stretched);
  }

  if (mutation.type === "rotate") {
    const mutatorOrigin = mutation.origin;
    const [x, y] = vecSub(newValue, mutatorOrigin);
    const angle = mutationValue[0] * -1;

    const rad = (angle * Math.PI) / 180;

    const rotated: Vec2 = [
      x * Math.cos(rad) - y * Math.sin(rad),
      y * Math.cos(rad) + x * Math.sin(rad),
    ];

    newValue = vecAdd(mutatorOrigin, rotated);
  }

  if (mutation.type === "deform") {
    const mutatorOrigin = mutation.origin;

    const effect = 1 - distance(mutatorOrigin, newValue) / mutation.radius;
    if (effect <= 1 && effect >= 0) {
      newValue = vecAdd(newValue, [
        mutationValue[0] * effect,
        mutationValue[1] * effect,
      ]);
    }
  }
  return newValue;
};

export const vectorPositions = (
  mutations: GeppettoImage["mutations"],
  mutationHierarchy: GeppettoImage["layerHierarchy"],
  mutationValues: VectorValues
): Record<string, Vec2> => {
  const result: Record<string, Vec2> = {};

  const makeMutationChain = (mutationId: string): string[] => {
    const chain: string[] = [mutationId];

    let parentId = getPreviousOfType(mutationHierarchy, "mutation", mutationId);
    while (parentId) {
      chain.push(parentId);
      parentId = getPreviousOfType(mutationHierarchy, "mutation", parentId);
    }
    return chain;
  };

  const applyMutationChain = (value: Vec2, mutationId: string | null): Vec2 => {
    if (mutationId === null) {
      return value;
    }
    const chain = makeMutationChain(mutationId);

    let newValue = value;
    for (const chainMutationId of chain) {
      const mutation = mutations[chainMutationId];
      newValue = applyMutation(
        newValue,
        mutation,
        mutationValues[chainMutationId]
      );
    }

    return newValue;
  };

  for (const [mutationId, mutation] of Object.entries(mutations)) {
    result[mutationId] = applyMutationChain(mutation.origin, mutationId);
  }

  return result;
};
