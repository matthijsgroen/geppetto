import { bench, describe } from "vitest";
import {
  mergeMutationValue,
  interpolateControlStep,
  recalculateMutationValues,
} from "./mutation-calculation";
import type { Vec2 } from "@geppetto/types";
import { ControlDefinition, MutationVector } from "src/types";

describe("mutation calculation performance", () => {
  describe("mergeMutationValue", () => {
    bench("multiplicative merge (stretch)", () => {
      mergeMutationValue([1.5, 2.0], [0.8, 1.2], "stretch");
    });

    bench("additive merge (translate)", () => {
      mergeMutationValue([10, 20], [5, -15], "translate");
    });

    bench("first-wins merge (colorize)", () => {
      mergeMutationValue([0.5, 0.7], [0.2, 0.3], "colorize");
    });
  });

  describe("interpolateControlStep", () => {
    const smallControl: Record<string, ControlDefinition> = {
      ctrl1: {
        name: "Small",
        type: "slider" as const,
        steps: [
          { mut1: [0, 0], mut2: [1, 1] },
          { mut1: [10, 20], mut2: [2, 2] },
          { mut1: [20, 40], mut2: [3, 3] },
        ],
      },
    };

    const largeControl: Record<string, ControlDefinition> = {
      ctrl1: {
        name: "Large",
        type: "slider" as const,
        steps: Array.from({ length: 50 }, (_, i) => ({
          mut1: [i * 10, i * 20] as Vec2,
          mut2: [i, i] as Vec2,
        })),
      },
    };

    const rawMutations: Record<string, MutationVector> = {
      mut1: {
        type: "translate",
        name: "Translation",
        origin: [0, 0] as Vec2,
        radius: -1,
      },
      mut2: { type: "stretch", name: "Stretch", origin: [0, 0] as Vec2 },
    };

    bench("interpolate small control (3 steps)", () => {
      interpolateControlStep(smallControl, rawMutations, ["ctrl1"], 0, 1.5);
    });

    bench("interpolate large control (50 steps)", () => {
      interpolateControlStep(largeControl, rawMutations, ["ctrl1"], 0, 25.5);
    });

    bench("interpolate with colorize (circular hue)", () => {
      const colorControl: Record<string, ControlDefinition> = {
        ctrl1: {
          name: "Color",
          type: "slider" as const,
          steps: [{ colorMut: [0.9, 0.5] }, { colorMut: [0.1, 0.8] }],
        },
      };
      const colorMutations: Record<string, MutationVector> = {
        colorMut: {
          type: "colorize",
          name: "Colorize",
          origin: [0, 0] as Vec2,
        },
      };
      interpolateControlStep(colorControl, colorMutations, ["ctrl1"], 0, 0.5);
    });
  });

  describe("recalculateMutationValues", () => {
    // Scenario 1: Small animation (10 controls, 20 mutations)
    const createSmallScenario = () => {
      const rawControls: Record<string, ControlDefinition> = {};
      const rawMutations: Record<string, MutationVector> = {};
      const mutatorMapping: Record<string, number> = {};

      // Create 20 mutations
      for (let i = 0; i < 20; i++) {
        const mutId = `mut${i}`;
        rawMutations[mutId] = {
          type: i % 3 === 0 ? "stretch" : i % 3 === 1 ? "translate" : "rotate",
          name: `Mutation ${i}`,
          origin: [0, 0] as Vec2,
        } as MutationVector;
        mutatorMapping[mutId] = i;
      }

      // Create 10 controls, each affecting 3-5 mutations
      for (let i = 0; i < 10; i++) {
        const ctrlId = `ctrl${i}`;
        rawControls[ctrlId] = {
          name: `Control ${i}`,
          type: "slider" as const,
          steps: [
            Object.fromEntries(
              Array.from({ length: 3 + (i % 3) }, (_, j) => [
                `mut${(i + j) % 20}`,
                [0, 0] as Vec2,
              ])
            ),
            Object.fromEntries(
              Array.from({ length: 3 + (i % 3) }, (_, j) => [
                `mut${(i + j) % 20}`,
                [10 + i, 20 + i] as Vec2,
              ])
            ),
          ],
        };
      }

      const mutationValues = new Float32Array(40);
      const controlValues = new Float32Array(10).fill(0.5);
      const defaultFrame = new Float32Array(40);

      return {
        mutationValues,
        controlValues,
        rawControls,
        rawMutations,
        mutatorMapping,
        defaultFrame,
      };
    };

    // Scenario 2: Medium animation (30 controls, 100 mutations)
    const createMediumScenario = () => {
      const rawControls: Record<string, ControlDefinition> = {};
      const rawMutations: Record<string, MutationVector> = {};
      const mutatorMapping: Record<string, number> = {};

      for (let i = 0; i < 100; i++) {
        const mutId = `mut${i}`;
        rawMutations[mutId] = {
          type: i % 3 === 0 ? "stretch" : i % 3 === 1 ? "translate" : "opacity",
          name: `Mutation ${i}`,
          origin: [0, 0] as Vec2,
        } as MutationVector;
        mutatorMapping[mutId] = i;
      }

      for (let i = 0; i < 30; i++) {
        const ctrlId = `ctrl${i}`;
        rawControls[ctrlId] = {
          name: `Control ${i}`,
          type: "slider" as const,
          steps: [
            Object.fromEntries(
              Array.from({ length: 5 }, (_, j) => [
                `mut${(i * 3 + j) % 100}`,
                [0, 0] as Vec2,
              ])
            ),
            Object.fromEntries(
              Array.from({ length: 5 }, (_, j) => [
                `mut${(i * 3 + j) % 100}`,
                [15 + i, 25 + i] as Vec2,
              ])
            ),
          ],
        };
      }

      const mutationValues = new Float32Array(200);
      const controlValues = new Float32Array(30).fill(0.5);
      const defaultFrame = new Float32Array(200);

      return {
        mutationValues,
        controlValues,
        rawControls,
        rawMutations,
        mutatorMapping,
        defaultFrame,
      };
    };

    // Scenario 3: Large animation (50 controls, 500 mutations)
    const createLargeScenario = () => {
      const rawControls: Record<string, ControlDefinition> = {};
      const rawMutations: Record<string, MutationVector> = {};
      const mutatorMapping: Record<string, number> = {};

      for (let i = 0; i < 500; i++) {
        const mutId = `mut${i}`;
        rawMutations[mutId] = {
          type:
            i % 4 === 0
              ? "stretch"
              : i % 4 === 1
                ? "translate"
                : i % 4 === 2
                  ? "rotate"
                  : "opacity",
          name: `Mutation ${i}`,
          origin: [0, 0] as Vec2,
        } as MutationVector;
        mutatorMapping[mutId] = i;
      }

      for (let i = 0; i < 50; i++) {
        const ctrlId = `ctrl${i}`;
        rawControls[ctrlId] = {
          name: `Control ${i}`,
          type: "slider" as const,
          steps: [
            Object.fromEntries(
              Array.from({ length: 8 }, (_, j) => [
                `mut${(i * 10 + j) % 500}`,
                [0, 0] as Vec2,
              ])
            ),
            Object.fromEntries(
              Array.from({ length: 8 }, (_, j) => [
                `mut${(i * 10 + j) % 500}`,
                [20 + i, 30 + i] as Vec2,
              ])
            ),
          ],
        };
      }

      const mutationValues = new Float32Array(1000);
      const controlValues = new Float32Array(50).fill(0.5);
      const defaultFrame = new Float32Array(1000);

      return {
        mutationValues,
        controlValues,
        rawControls,
        rawMutations,
        mutatorMapping,
        defaultFrame,
      };
    };

    bench("small scene (10 controls, 20 mutations)", () => {
      const scenario = createSmallScenario();
      recalculateMutationValues(
        scenario.mutationValues,
        scenario.controlValues,
        scenario.rawControls,
        scenario.rawMutations,
        scenario.mutatorMapping,
        scenario.defaultFrame
      );
    });

    bench("medium scene (30 controls, 100 mutations)", () => {
      const scenario = createMediumScenario();
      recalculateMutationValues(
        scenario.mutationValues,
        scenario.controlValues,
        scenario.rawControls,
        scenario.rawMutations,
        scenario.mutatorMapping,
        scenario.defaultFrame
      );
    });

    bench("large scene (50 controls, 500 mutations)", () => {
      const scenario = createLargeScenario();
      recalculateMutationValues(
        scenario.mutationValues,
        scenario.controlValues,
        scenario.rawControls,
        scenario.rawMutations,
        scenario.mutatorMapping,
        scenario.defaultFrame
      );
    });
  });
});
