import type { Vec2 } from "@geppetto/types";
import type { PreparedImageDefinition } from "../types";
import { mix, mixHue } from "../vertices";

/**
 * Merges two mutation values based on the mutation type.
 *
 * Different mutation types combine differently:
 * - Multiplicative (stretch, lightness, opacity, saturation): component-wise multiplication
 * - First-wins (colorize): returns first value unchanged
 * - Additive (translate, rotate, deform, others): component-wise addition
 *
 * @param a First mutation value
 * @param b Second mutation value
 * @param mutationType Type of mutation (translate, stretch, colorize, etc.)
 * @returns Merged mutation value
 */
export const mergeMutationValue = (
  a: Vec2,
  b: Vec2,
  mutationType: string
): Vec2 => {
  // Multiplicative mutations: stretch, lightness, opacity, saturation
  if (
    mutationType === "stretch" ||
    mutationType === "lightness" ||
    mutationType === "opacity" ||
    mutationType === "saturation"
  ) {
    return [a[0] * b[0], a[1] * b[1]];
  }
  // Colorize: take one or the other (first wins)
  if (mutationType === "colorize") {
    return a;
  }
  // Additive mutations: translate, rotate, deform
  return [a[0] + b[0], a[1] + b[1]];
};

/**
 * Interpolates mutation values between control steps.
 *
 * Handles fractional control values (e.g., 1.5 interpolates between step 1 and 2).
 * Uses circular interpolation for colorize mutations (hue wrapping).
 *
 * @param rawControls Control definitions with steps
 * @param rawMutations Mutation type information
 * @param controlIds Ordered list of control IDs
 * @param controlIndex Which control to interpolate
 * @param controlValue The fractional step value (e.g., 0.5, 1.7, 2.0)
 * @returns Map of mutation IDs to interpolated Vec2 values
 */
export const interpolateControlStep = (
  rawControls: PreparedImageDefinition["rawControls"],
  rawMutations: PreparedImageDefinition["rawMutations"],
  controlIds: string[],
  controlIndex: number,
  controlValue: number
): Record<string, Vec2> => {
  const controlId = controlIds[controlIndex];
  const control = rawControls[controlId];
  if (!control) return {};

  // Clamp to valid range
  const clampedValue = Math.max(
    0,
    Math.min(controlValue, control.steps.length - 1)
  );

  const minStep = Math.floor(clampedValue);
  const maxStep = Math.ceil(clampedValue);
  const stepLimit = control.steps.length - 1;

  const minValue = control.steps[Math.min(minStep, stepLimit)];
  const maxValue = control.steps[Math.min(maxStep, stepLimit)];

  const mixValue = clampedValue - minStep;

  const result: Record<string, Vec2> = {};
  for (const [mutationId, mutationValue] of Object.entries(minValue)) {
    const endValue = maxValue[mutationId] || mutationValue;
    const mutationInfo = rawMutations[mutationId];

    // Use circular interpolation for colorize mutations (hue is circular)
    if (mutationInfo?.type === "colorize") {
      result[mutationId] = [
        mixHue(mutationValue[0], endValue[0], mixValue),
        mix(mutationValue[1], endValue[1], mixValue),
      ];
    } else {
      result[mutationId] = [
        mix(mutationValue[0], endValue[0], mixValue),
        mix(mutationValue[1], endValue[1], mixValue),
      ];
    }
  }

  return result;
};

/**
 * Recalculates all mutation values from scratch using defaultFrame + all control values.
 *
 * This implements the same algorithm as studio's calculateVectorValues:
 * 1. Start with defaultFrame baseline values
 * 2. For each control, interpolate its current step
 * 3. Merge each control's mutations with existing values using type-specific logic
 *
 * Mutates the mutationValues array in-place.
 *
 * @param mutationValues Float32Array to update (modified in-place)
 * @param controlValues Current control values in step scale
 * @param rawControls Control definitions
 * @param rawMutations Mutation type information
 * @param mutatorMapping Maps mutation IDs to array indices
 * @param defaultFrame Baseline mutation values from the file
 */
export const recalculateMutationValues = (
  mutationValues: Float32Array,
  controlValues: Float32Array,
  rawControls: PreparedImageDefinition["rawControls"],
  rawMutations: PreparedImageDefinition["rawMutations"],
  mutatorMapping: Record<string, number>,
  defaultFrame: Float32Array
): void => {
  // Start with defaultFrame values
  for (let i = 0; i < mutationValues.length; i++) {
    mutationValues[i] = defaultFrame[i];
  }

  // Apply each control's modifications
  const controlIds = Object.keys(rawControls);
  for (
    let controlIndex = 0;
    controlIndex < controlValues.length;
    controlIndex++
  ) {
    const controlValue = controlValues[controlIndex];

    const mutationUpdates = interpolateControlStep(
      rawControls,
      rawMutations,
      controlIds,
      controlIndex,
      controlValue
    );

    // Merge control mutations with existing mutation values
    for (const [mutationId, mutationValue] of Object.entries(mutationUpdates)) {
      const mutationIndex = mutatorMapping[mutationId];
      const mutationType = rawMutations[mutationId]?.type;
      if (mutationIndex !== undefined && mutationType) {
        const currentValue: Vec2 = [
          mutationValues[mutationIndex * 2],
          mutationValues[mutationIndex * 2 + 1],
        ];
        const merged = mergeMutationValue(
          mutationValue,
          currentValue,
          mutationType
        );
        mutationValues[mutationIndex * 2] = merged[0];
        mutationValues[mutationIndex * 2 + 1] = merged[1];
      }
    }
  }
};
