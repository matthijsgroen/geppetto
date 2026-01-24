import { describe, it, expect } from "vitest";
import {
  mergeMutationValue,
  interpolateControlStep,
  recalculateMutationValues,
} from "./mutation-calculation";
import type { Vec2 } from "@geppetto/types";

describe("mergeMutationValue", () => {
  describe("multiplicative mutations", () => {
    it("multiplies components for stretch mutations", () => {
      const result = mergeMutationValue([2, 3], [4, 5], "stretch");
      expect(result).toEqual([8, 15]);
    });

    it("multiplies components for opacity mutations", () => {
      const result = mergeMutationValue([0.5, 0.8], [0.5, 0.5], "opacity");
      expect(result).toEqual([0.25, 0.4]);
    });

    it("multiplies components for lightness mutations", () => {
      const result = mergeMutationValue([1.2, 1.5], [0.8, 0.5], "lightness");
      expect(result).toEqual([0.96, 0.75]);
    });

    it("multiplies components for saturation mutations", () => {
      const result = mergeMutationValue([1.5, 2.0], [2.0, 1.5], "saturation");
      expect(result).toEqual([3.0, 3.0]);
    });
  });

  describe("first-wins mutations", () => {
    it("returns first value for colorize mutations", () => {
      const result = mergeMutationValue([0.5, 0.7], [0.2, 0.3], "colorize");
      expect(result).toEqual([0.5, 0.7]);
    });

    it("ignores second value completely for colorize", () => {
      const result = mergeMutationValue([1.0, 1.0], [0, 0], "colorize");
      expect(result).toEqual([1.0, 1.0]);
    });
  });

  describe("additive mutations", () => {
    it("adds components for translate mutations", () => {
      const result = mergeMutationValue([10, 20], [5, -10], "translate");
      expect(result).toEqual([15, 10]);
    });

    it("adds components for rotate mutations", () => {
      const result = mergeMutationValue([45, 0], [15, 0], "rotate");
      expect(result).toEqual([60, 0]);
    });

    it("adds components for deform mutations", () => {
      const result = mergeMutationValue([5, 3], [2, 7], "deform");
      expect(result).toEqual([7, 10]);
    });

    it("defaults to additive for unknown mutation types", () => {
      const result = mergeMutationValue([1, 2], [3, 4], "unknown");
      expect(result).toEqual([4, 6]);
    });
  });

  describe("edge cases", () => {
    it("handles zero values in multiplicative mutations", () => {
      const result = mergeMutationValue([0, 5], [2, 0], "stretch");
      expect(result).toEqual([0, 0]);
    });

    it("handles negative values in additive mutations", () => {
      const result = mergeMutationValue([-10, 5], [15, -20], "translate");
      expect(result).toEqual([5, -15]);
    });

    it("handles identity values for multiplicative (1, 1)", () => {
      const result = mergeMutationValue([1, 1], [5, 10], "opacity");
      expect(result).toEqual([5, 10]);
    });

    it("handles identity values for additive (0, 0)", () => {
      const result = mergeMutationValue([0, 0], [5, 10], "translate");
      expect(result).toEqual([5, 10]);
    });
  });
});

describe("interpolateControlStep", () => {
  const rawControls = {
    control1: {
      name: "TestControl",
      type: "slider" as const,
      steps: [
        { mut1: [0, 0] as Vec2, mut2: [10, 20] as Vec2 },
        { mut1: [100, 200] as Vec2, mut2: [30, 40] as Vec2 },
        { mut1: [200, 400] as Vec2, mut2: [50, 60] as Vec2 },
      ],
    },
    controlColorize: {
      name: "ColorControl",
      type: "slider" as const,
      steps: [
        { colorMut: [0.9, 0.5] as Vec2 },
        { colorMut: [0.1, 0.8] as Vec2 },
      ],
    },
  };

  const rawMutations = {
    mut1: {
      type: "translate" as const,
      name: "Translation",
      origin: [0, 0] as Vec2,
      radius: 100,
    },
    mut2: { type: "stretch" as const, name: "Stretch", origin: [0, 0] as Vec2 },
    colorMut: {
      type: "colorize" as const,
      name: "Colorize",
      origin: [0, 0] as Vec2,
    },
  };

  const controlIds = ["control1", "controlColorize"];

  describe("integer step values", () => {
    it("returns exact step values for step 0", () => {
      const result = interpolateControlStep(
        rawControls,
        rawMutations,
        controlIds,
        0,
        0
      );
      expect(result).toEqual({
        mut1: [0, 0],
        mut2: [10, 20],
      });
    });

    it("returns exact step values for step 1", () => {
      const result = interpolateControlStep(
        rawControls,
        rawMutations,
        controlIds,
        0,
        1
      );
      expect(result).toEqual({
        mut1: [100, 200],
        mut2: [30, 40],
      });
    });

    it("returns exact step values for last step", () => {
      const result = interpolateControlStep(
        rawControls,
        rawMutations,
        controlIds,
        0,
        2
      );
      expect(result).toEqual({
        mut1: [200, 400],
        mut2: [50, 60],
      });
    });
  });

  describe("fractional step values", () => {
    it("interpolates at 50% between steps 0 and 1", () => {
      const result = interpolateControlStep(
        rawControls,
        rawMutations,
        controlIds,
        0,
        0.5
      );
      expect(result).toEqual({
        mut1: [50, 100],
        mut2: [20, 30],
      });
    });

    it("interpolates at 25% between steps 1 and 2", () => {
      const result = interpolateControlStep(
        rawControls,
        rawMutations,
        controlIds,
        0,
        1.25
      );
      expect(result).toEqual({
        mut1: [125, 250],
        mut2: [35, 45],
      });
    });

    it("interpolates at 75% between steps 0 and 1", () => {
      const result = interpolateControlStep(
        rawControls,
        rawMutations,
        controlIds,
        0,
        0.75
      );
      expect(result).toEqual({
        mut1: [75, 150],
        mut2: [25, 35],
      });
    });
  });

  describe("colorize hue wrapping", () => {
    it("wraps hue from 0.9 to 0.1 correctly (short path through 0/1)", () => {
      const result = interpolateControlStep(
        rawControls,
        rawMutations,
        controlIds,
        1,
        0.5
      );

      // Hue should wrap: 0.9 -> 1.0 -> 0.0 -> 0.1 (distance 0.2)
      // At 50%, should be at 0.0 (or 1.0, equivalent)
      const hue = result.colorMut[0];
      expect(hue).toBeCloseTo(0, 5); // Should be very close to 0 or 1

      // Saturation should interpolate normally
      expect(result.colorMut[1]).toBeCloseTo(0.65, 5);
    });

    it("interpolates colorize saturation component linearly", () => {
      const result = interpolateControlStep(
        rawControls,
        rawMutations,
        controlIds,
        1,
        0.3
      );

      // Saturation: 0.5 + (0.8 - 0.5) * 0.3 = 0.5 + 0.09 = 0.59
      expect(result.colorMut[1]).toBeCloseTo(0.59, 5);
    });
  });

  describe("out-of-bounds handling", () => {
    it("clamps to last step when value exceeds step count", () => {
      const result = interpolateControlStep(
        rawControls,
        rawMutations,
        controlIds,
        0,
        10.0
      );
      expect(result).toEqual({
        mut1: [200, 400],
        mut2: [50, 60],
      });
    });

    it("clamps to first step when value is negative", () => {
      const result = interpolateControlStep(
        rawControls,
        rawMutations,
        controlIds,
        0,
        -1.0
      );
      // Should clamp to step 0
      expect(result).toEqual({
        mut1: [0, 0],
        mut2: [10, 20],
      });
    });
  });

  describe("edge cases", () => {
    it("returns empty object for non-existent control", () => {
      const result = interpolateControlStep(
        rawControls,
        rawMutations,
        controlIds,
        99,
        0.5
      );
      expect(result).toEqual({});
    });

    it("handles control with single step", () => {
      const singleStepControls = {
        single: {
          name: "Single",
          type: "slider" as const,
          steps: [{ mut1: [5, 10] as Vec2 }],
        },
      };
      const result = interpolateControlStep(
        singleStepControls,
        rawMutations,
        ["single"],
        0,
        0.5
      );
      expect(result).toEqual({ mut1: [5, 10] });
    });

    it("handles missing mutation in step gracefully", () => {
      const partialControls = {
        partial: {
          name: "Partial",
          type: "slider" as const,
          steps: [{ mut1: [0, 0] as Vec2 }, { mut1: [100, 200] as Vec2 }],
        },
      };
      const result = interpolateControlStep(
        partialControls,
        rawMutations,
        ["partial"],
        0,
        0.5
      );
      expect(result.mut1).toEqual([50, 100]);
    });
  });
});

describe("recalculateMutationValues", () => {
  const rawControls = {
    ctrl1: {
      name: "Control1",
      type: "slider" as const,
      steps: [{ mut1: [0, 0] as Vec2 }, { mut1: [10, 20] as Vec2 }],
    },
    ctrl2: {
      name: "Control2",
      type: "slider" as const,
      steps: [{ mut2: [1, 1] as Vec2 }, { mut2: [2, 2] as Vec2 }],
    },
    ctrl3: {
      name: "Control3",
      type: "slider" as const,
      steps: [{ mut1: [0, 0] as Vec2 }, { mut1: [5, 10] as Vec2 }],
    },
  };

  const rawMutations = {
    mut1: {
      type: "translate" as const,
      name: "Translation",
      origin: [0, 0] as Vec2,
      radius: 100,
    },
    mut2: { type: "stretch" as const, name: "Stretch", origin: [0, 0] as Vec2 },
  };

  const mutatorMapping = {
    mut1: 0,
    mut2: 1,
  };

  describe("baseline behavior", () => {
    it("sets mutation values to defaultFrame when no controls active", () => {
      const mutationValues = new Float32Array(4);
      const controlValues = new Float32Array([0, 0, 0]);
      const defaultFrame = new Float32Array([100, 200, 1.5, 2.5]);

      recalculateMutationValues(
        mutationValues,
        controlValues,
        rawControls,
        rawMutations,
        mutatorMapping,
        defaultFrame
      );

      expect(Array.from(mutationValues)).toEqual([100, 200, 1.5, 2.5]);
    });

    it("applies single control's mutations to default", () => {
      const mutationValues = new Float32Array(4);
      const controlValues = new Float32Array([1, 0, 0]); // ctrl1 at step 1
      const defaultFrame = new Float32Array([0, 0, 1, 1]);

      recalculateMutationValues(
        mutationValues,
        controlValues,
        rawControls,
        rawMutations,
        mutatorMapping,
        defaultFrame
      );

      // mut1 is translate (additive): 0 + 10 = 10, 0 + 20 = 20
      // mut2 is unchanged: 1, 1
      expect(Array.from(mutationValues)).toEqual([10, 20, 1, 1]);
    });

    it("applies fractional control value with interpolation", () => {
      const mutationValues = new Float32Array(4);
      const controlValues = new Float32Array([0.5, 0, 0]); // ctrl1 at 50%
      const defaultFrame = new Float32Array([0, 0, 1, 1]);

      recalculateMutationValues(
        mutationValues,
        controlValues,
        rawControls,
        rawMutations,
        mutatorMapping,
        defaultFrame
      );

      // mut1 interpolates to [5, 10] then adds: 0 + 5 = 5, 0 + 10 = 10
      expect(Array.from(mutationValues)).toEqual([5, 10, 1, 1]);
    });
  });

  describe("multiple controls", () => {
    it("correctly merges two non-overlapping controls", () => {
      const mutationValues = new Float32Array(4);
      const controlValues = new Float32Array([1, 1, 0]); // ctrl1 & ctrl2 active
      const defaultFrame = new Float32Array([0, 0, 1, 1]);

      recalculateMutationValues(
        mutationValues,
        controlValues,
        rawControls,
        rawMutations,
        mutatorMapping,
        defaultFrame
      );

      // mut1: 0 + 10 = 10, 0 + 20 = 20 (from ctrl1)
      // mut2: 1 * 2 = 2, 1 * 2 = 2 (from ctrl2, multiplicative)
      expect(Array.from(mutationValues)).toEqual([10, 20, 2, 2]);
    });

    it("correctly merges overlapping additive controls", () => {
      const mutationValues = new Float32Array(4);
      const controlValues = new Float32Array([1, 0, 1]); // ctrl1 & ctrl3 both affect mut1
      const defaultFrame = new Float32Array([0, 0, 1, 1]);

      recalculateMutationValues(
        mutationValues,
        controlValues,
        rawControls,
        rawMutations,
        mutatorMapping,
        defaultFrame
      );

      // mut1 is additive (translate):
      // Start: [0, 0]
      // After ctrl1: [0+10, 0+20] = [10, 20]
      // After ctrl3: [10+5, 20+10] = [15, 30]
      expect(Array.from(mutationValues)).toEqual([15, 30, 1, 1]);
    });
  });

  describe("mutation merge order", () => {
    it("applies controls in order (matters for non-commutative operations)", () => {
      const multiplyControls = {
        mult1: {
          name: "Multiply1",
          type: "slider" as const,
          steps: [{ mut2: [1, 1] as Vec2 }, { mut2: [2, 3] as Vec2 }],
        },
        mult2: {
          name: "Multiply2",
          type: "slider" as const,
          steps: [{ mut2: [1, 1] as Vec2 }, { mut2: [4, 5] as Vec2 }],
        },
      };

      const mutationValues = new Float32Array(4);
      const controlValues = new Float32Array([1, 1]); // Both at step 1
      const defaultFrame = new Float32Array([0, 0, 1, 1]);

      recalculateMutationValues(
        mutationValues,
        controlValues,
        multiplyControls,
        rawMutations,
        mutatorMapping,
        defaultFrame
      );

      // mut2 is multiplicative (stretch):
      // Start: [1, 1]
      // After mult1: [1*2, 1*3] = [2, 3]
      // After mult2: [2*4, 3*5] = [8, 15]
      expect(Array.from(mutationValues)).toEqual([0, 0, 8, 15]);
    });
  });

  describe("edge cases", () => {
    it("handles empty controls array", () => {
      const mutationValues = new Float32Array(4);
      const controlValues = new Float32Array([]);
      const defaultFrame = new Float32Array([10, 20, 30, 40]);

      recalculateMutationValues(
        mutationValues,
        controlValues,
        {},
        rawMutations,
        mutatorMapping,
        defaultFrame
      );

      expect(Array.from(mutationValues)).toEqual([10, 20, 30, 40]);
    });

    it("handles mutations not in mapping", () => {
      const mutationValues = new Float32Array(4);
      const controlValues = new Float32Array([1, 0, 0]);
      const defaultFrame = new Float32Array([0, 0, 1, 1]);
      const emptyMapping = {};

      recalculateMutationValues(
        mutationValues,
        controlValues,
        rawControls,
        rawMutations,
        emptyMapping,
        defaultFrame
      );

      // Mutations aren't in mapping, so values should equal defaults
      expect(Array.from(mutationValues)).toEqual([0, 0, 1, 1]);
    });

    it("preserves defaultFrame values for mutations not affected by controls", () => {
      const mutationValues = new Float32Array(4);
      const controlValues = new Float32Array([0, 1, 0]); // Only ctrl2 active
      const defaultFrame = new Float32Array([100, 200, 1, 1]);

      recalculateMutationValues(
        mutationValues,
        controlValues,
        rawControls,
        rawMutations,
        mutatorMapping,
        defaultFrame
      );

      // mut1 should keep defaultFrame: [100, 200]
      // mut2 should be: [1*2, 1*2] = [2, 2]
      expect(Array.from(mutationValues)).toEqual([100, 200, 2, 2]);
    });
  });
});
