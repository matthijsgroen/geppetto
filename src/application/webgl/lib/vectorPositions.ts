import { getPreviousOfType } from "../../../animation/file2/hierarchy";
import { GeppettoImage } from "../../../animation/file2/types";
import { Vec2 } from "../../../types";
import {
  distance,
  mergeMutationValue,
  mixHueVec2,
  mixVec2,
  vecAdd,
  vecSub,
} from "./vertices";

type VectorValues = GeppettoImage["defaultFrame"];

export const calculateVectorValues = (file: GeppettoImage): VectorValues => {
  const result: VectorValues = { ...file.defaultFrame };
  for (const [controlId, controlValue] of Object.entries(file.controlValues)) {
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

export const vectorPositions = (
  mutations: GeppettoImage["mutations"],
  mutationHierarchy: GeppettoImage["layerHierarchy"],
  mutationValues: VectorValues
): Record<string, Vec2> => {
  const result: Record<string, Vec2> = {};

  const applyMutation = (value: Vec2, mutationId: string | null): Vec2 => {
    if (mutationId === null) {
      return value;
    }
    const parentId = getPreviousOfType(
      mutationHierarchy,
      "mutation",
      mutationId
    );

    const mutation = mutations[mutationId];
    let newValue = value;
    if (mutation.type === "translate") {
      const mutatorOrigin = mutation.origin;
      if (
        mutation.radius === -1 ||
        inRadius(mutatorOrigin, newValue, mutation.radius)
      ) {
        const translationValue = mutationValues[mutationId];
        newValue = vecAdd(newValue, translationValue);
      }
    }

    if (mutation.type === "deform") {
      const mutatorOrigin = mutation.origin;

      const effect = 1 - distance(mutatorOrigin, newValue) / mutation.radius;
      if (effect <= 1 && effect >= 0) {
        const translationValue = mutationValues[mutationId];
        newValue = vecAdd(newValue, [
          translationValue[0] * effect,
          translationValue[1] * effect,
        ]);
      }
    }

    if (mutation.type === "rotate") {
      const mutatorOrigin = mutation.origin;
      const [x, y] = vecSub(newValue, mutatorOrigin);
      const angle = mutationValues[mutationId][0];

      const rad = (angle * Math.PI) / 180;

      const rotated: Vec2 = [
        x * Math.cos(rad) - y * Math.sin(rad),
        y * Math.cos(rad) + x * Math.sin(rad),
      ];

      newValue = vecAdd(mutatorOrigin, rotated);
    }

    return applyMutation(newValue, parentId);
  };

  for (const [mutationId, mutation] of Object.entries(mutations)) {
    result[mutationId] = applyMutation(mutation.origin, mutationId);
  }

  return result;
};
