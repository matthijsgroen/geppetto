import { bench, describe } from "vitest";
import type { PreparedImageDefinition } from "./types";

/**
 * Benchmark to measure dirty tracking performance gains.
 * This simulates idle scenes where controls don't change between frames.
 */

// Create a test scene with specified complexity
const createTestScene = (
  layerCount: number,
  mutationCount: number,
  controlCount: number
): PreparedImageDefinition => {
  const layers = [];
  const mutators = { data: new Float32Array(mutationCount * 2), size: mutationCount };
  const mutatorParents = { data: new Int32Array(mutationCount), size: mutationCount };
  const mutationValues = { data: new Float32Array(mutationCount * 2), size: mutationCount };
  const defaultControlValues = new Float32Array(controlCount);
  const rawControls: Record<string, { steps: { value: number[] }[] }> = {};
  const rawMutations: Record<string, { controlId: string; steps: { value: number[] }[] }> = {};
  const mutatorMapping: Record<string, number> = {};

  // Initialize default control values (all at 0.5)
  for (let i = 0; i < controlCount; i++) {
    defaultControlValues[i] = 0.5;
    const controlId = `ctrl${i}`;
    rawControls[controlId] = {
      steps: [
        { value: [0, 0] },
        { value: [0.5, 0.5] },
        { value: [1, 1] },
      ],
    };
  }

  // Create mutations
  for (let i = 0; i < mutationCount; i++) {
    const mutationId = `mut${i}`;
    const controlId = `ctrl${i % controlCount}`;
    mutatorMapping[mutationId] = i;
    rawMutations[mutationId] = {
      controlId,
      steps: [
        { value: [0, 0] },
        { value: [Math.random(), Math.random()] },
        { value: [1, 1] },
      ],
    };
    mutationValues.data[i * 2] = 0;
    mutationValues.data[i * 2 + 1] = 0;
    mutatorParents.data[i] = -1;
  }

  // Create layers
  for (let i = 0; i < layerCount; i++) {
    layers.push({
      x: 0,
      y: 0,
      z: i * 0.01,
      mutator: i % mutationCount,
      start: 0,
      amount: 6,
    });
  }

  return {
    metadata: {
      width: 100,
      height: 100,
      zoom: 1,
      pan: [0, 0],
    },
    layers,
    mutators,
    mutatorParents,
    mutationValues,
    defaultControlValues,
    rawControls,
    rawMutations,
    mutatorMapping,
    animations: [],
    animationNames: new Map(),
    controlNames: new Map(Object.keys(rawControls).map((k, i) => [k, i])),
  } as unknown as PreparedImageDefinition;
};

/**
 * Simulates the render loop with dirty tracking.
 * Returns true if recalculation was performed, false if skipped.
 */
const simulateRender = (
  renderControlValues: Float32Array,
  lastControlValues: Float32Array,
  controlChangeFlags: Uint8Array
): boolean => {
  // Check if any controls have changed since last render
  let hasChanges = false;
  for (let i = 0; i < renderControlValues.length; i++) {
    if (renderControlValues[i] !== lastControlValues[i]) {
      controlChangeFlags[i] = 1;
      hasChanges = true;
    }
  }
  
  if (hasChanges) {
    // Simulate recalculation (in real code this would call recalculateMutationValues)
    controlChangeFlags.fill(0);
    lastControlValues.set(renderControlValues);
    return true;
  }
  
  return false;
};

describe("dirty tracking performance", () => {
  bench("idle scene - no changes (small: 5 layers, 10 mutations, 3 controls)", () => {
    const scene = createTestScene(5, 10, 3);
    const renderControlValues = new Float32Array(scene.defaultControlValues);
    const lastControlValues = new Float32Array(renderControlValues);
    const controlChangeFlags = new Uint8Array(renderControlValues.length);
    
    // Simulate rendering with no control changes
    simulateRender(renderControlValues, lastControlValues, controlChangeFlags);
  });

  bench("idle scene - no changes (medium: 20 layers, 80 mutations, 10 controls)", () => {
    const scene = createTestScene(20, 80, 10);
    const renderControlValues = new Float32Array(scene.defaultControlValues);
    const lastControlValues = new Float32Array(renderControlValues);
    const controlChangeFlags = new Uint8Array(renderControlValues.length);
    
    // Simulate rendering with no control changes
    simulateRender(renderControlValues, lastControlValues, controlChangeFlags);
  });

  bench("idle scene - no changes (large: 50 layers, 250 mutations, 20 controls)", () => {
    const scene = createTestScene(50, 250, 20);
    const renderControlValues = new Float32Array(scene.defaultControlValues);
    const lastControlValues = new Float32Array(renderControlValues);
    const controlChangeFlags = new Uint8Array(renderControlValues.length);
    
    // Simulate rendering with no control changes
    simulateRender(renderControlValues, lastControlValues, controlChangeFlags);
  });

  bench("active scene - 1 control changes (small: 5 layers, 10 mutations, 3 controls)", () => {
    const scene = createTestScene(5, 10, 3);
    const renderControlValues = new Float32Array(scene.defaultControlValues);
    const lastControlValues = new Float32Array(renderControlValues);
    const controlChangeFlags = new Uint8Array(renderControlValues.length);
    
    // Simulate rendering with 1 control changing
    renderControlValues[0] = Math.random();
    simulateRender(renderControlValues, lastControlValues, controlChangeFlags);
  });

  bench("active scene - 1 control changes (medium: 20 layers, 80 mutations, 10 controls)", () => {
    const scene = createTestScene(20, 80, 10);
    const renderControlValues = new Float32Array(scene.defaultControlValues);
    const lastControlValues = new Float32Array(renderControlValues);
    const controlChangeFlags = new Uint8Array(renderControlValues.length);
    
    // Simulate rendering with 1 control changing
    renderControlValues[0] = Math.random();
    simulateRender(renderControlValues, lastControlValues, controlChangeFlags);
  });

  bench("active scene - 1 control changes (large: 50 layers, 250 mutations, 20 controls)", () => {
    const scene = createTestScene(50, 250, 20);
    const renderControlValues = new Float32Array(scene.defaultControlValues);
    const lastControlValues = new Float32Array(renderControlValues);
    const controlChangeFlags = new Uint8Array(renderControlValues.length);
    
    // Simulate rendering with 1 control changing
    renderControlValues[0] = Math.random();
    simulateRender(renderControlValues, lastControlValues, controlChangeFlags);
  });
});
