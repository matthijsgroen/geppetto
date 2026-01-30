import { bench, describe } from "vitest";
import type {
  ControlDefinition,
  GeppettoImage,
  Hierarchy,
  Keyframe,
  Layer,
  MutationVector,
  Vec2,
} from "@geppetto/types";
import { prepareAnimation } from "./prepareAnimation";
import { recalculateMutationValues } from "./lib/mutation-calculation";

describe("runtime performance", () => {
  // Create test scenes of varying complexity
  const createTestScene = (
    layerCount: number,
    mutationsPerLayer: number,
    controlCount: number
  ): GeppettoImage => {
    const layers: Record<string, Layer> = {};
    const mutations: Record<string, MutationVector> = {};
    const layerHierarchy: Hierarchy<"layer" | "layerFolder" | "mutation"> = {
      root: {
        type: "root",
        children: [] as string[],
      },
    };
    const controls: Record<string, ControlDefinition> = {};
    const controlHierarchy: Hierarchy<"control" | "controlFolder"> = {
      root: {
        type: "root",
        children: [],
      },
    };

    // Create layers with mutations
    for (let i = 0; i < layerCount; i++) {
      const layerId = `layer${i}`;
      const mutationIds: string[] = [];

      // Create mutations for this layer
      for (let j = 0; j < mutationsPerLayer; j++) {
        const mutId = `mut${i}_${j}`;
        mutations[mutId] = {
          type:
            j % 4 === 0
              ? "translate"
              : j % 4 === 1
                ? "rotate"
                : j % 4 === 2
                  ? "deform"
                  : "opacity",
          origin: [50, 50],
          radius: j % 4 === 2 ? 30 : -1,
        } as MutationVector;
        mutationIds.push(mutId);

        layerHierarchy[mutId] = {
          type: "mutation",
          parentId: layerId,
        };
      }

      layers[layerId] = {
        name: `Layer ${i}`,
        points: [
          [0, 0],
          [10, 10],
          [5, 5],
        ],
        translate: [i * 10, i * 10],
        visible: true,
      };

      layerHierarchy[layerId] = {
        type: "layer",
        parentId: "root",
        children: mutationIds,
      };

      (layerHierarchy["root"].children as string[]).push(layerId);
    }

    // Create controls that affect mutations
    for (let i = 0; i < controlCount; i++) {
      const ctrlId = `ctrl${i}`;
      const steps: Keyframe[] = [];

      // Each control affects a few random mutations
      const affectedMutations = Math.min(5, Object.keys(mutations).length);
      const step1: Record<string, Vec2> = {};
      const step2: Record<string, Vec2> = {};

      for (let j = 0; j < affectedMutations; j++) {
        const mutKey = `mut${Math.floor(Math.random() * layerCount)}_${Math.floor(Math.random() * mutationsPerLayer)}`;
        if (mutations[mutKey]) {
          step1[mutKey] = [Math.random() * 100, Math.random() * 100];
          step2[mutKey] = [Math.random() * 100, Math.random() * 100];
        }
      }

      steps.push(step1, step2);

      controls[ctrlId] = {
        name: `Control ${i}`,
        type: "slider",
        steps,
      };

      controlHierarchy[ctrlId] = {
        type: "control",
        parentId: "root",
      };

      (controlHierarchy["root"].children as string[]).push(ctrlId);
    }

    return {
      version: "2.0",
      metadata: {
        width: 1024,
        height: 768,
        zoom: 1,
        pan: [0, 0],
      },
      layerHierarchy,
      layers,
      mutations,
      layerFolders: {},
      controlHierarchy,
      defaultFrame: {},
      controlValues: {},
      controls,
      controlFolders: {},
      animations: {},
    };
  };

  // Prepare test scenes
  const smallScene = prepareAnimation(createTestScene(5, 2, 3), {
    validate: false,
  });
  const mediumScene = prepareAnimation(createTestScene(20, 4, 10), {
    validate: false,
  });
  const largeScene = prepareAnimation(createTestScene(50, 5, 20), {
    validate: false,
  });

  bench(
    "mutation recalculation - small scene (5 layers, 10 mutations, 3 controls)",
    () => {
      // Simulate changing control values
      const controlValues = new Float32Array(3);
      controlValues[0] = Math.random();
      controlValues[1] = Math.random();
      controlValues[2] = Math.random();

      recalculateMutationValues(
        smallScene.mutationValues.data,
        controlValues,
        smallScene.rawControls,
        smallScene.rawMutations,
        smallScene.mutatorMapping,
        smallScene.mutationValues.data // Using current values as default for benchmark
      );
    }
  );

  bench(
    "mutation recalculation - medium scene (20 layers, 80 mutations, 10 controls)",
    () => {
      const controlValues = new Float32Array(10);
      for (let i = 0; i < 10; i++) {
        controlValues[i] = Math.random();
      }

      recalculateMutationValues(
        mediumScene.mutationValues.data,
        controlValues,
        mediumScene.rawControls,
        mediumScene.rawMutations,
        mediumScene.mutatorMapping,
        mediumScene.mutationValues.data // Using current values as default for benchmark
      );
    }
  );

  bench(
    "mutation recalculation - large scene (50 layers, 250 mutations, 20 controls)",
    () => {
      const controlValues = new Float32Array(20);
      for (let i = 0; i < 20; i++) {
        controlValues[i] = Math.random();
      }

      recalculateMutationValues(
        largeScene.mutationValues.data,
        controlValues,
        largeScene.rawControls,
        largeScene.rawMutations,
        largeScene.mutatorMapping,
        largeScene.mutationValues.data // Using current values as default for benchmark
      );
    }
  );
});
