import {
  addLayer,
  addVector,
  newDefinition,
  updateVectorData,
} from "./definitionHelpers";
import { ImageDefinition, MutationVector } from "./types";

const mutationState = (initial: ImageDefinition) => {
  let state = initial;

  return {
    getState: () => state,
    mutator: (mutation: (prev: ImageDefinition) => ImageDefinition) => {
      state = mutation(state);
    },
  };
};

describe("addLayer", () => {
  it("adds a layer to an empty image", async () => {
    const emptyImage = newDefinition();
    const test = mutationState(emptyImage);

    expect(test.getState().shapes).toHaveLength(0);
    const newLayer = await addLayer(test.mutator, "First Layer");

    expect(newLayer).toEqual({
      name: "First Layer",
      type: "sprite",
      translate: [0, 0],
      mutationVectors: [],
      points: [],
    });
    expect(test.getState().shapes).toHaveLength(1);
    expect(test.getState().shapes[0]).toBe(newLayer);
  });

  it("renames layers to ensure unique names", async () => {
    const emptyImage = newDefinition();
    const test = mutationState(emptyImage);
    await addLayer(test.mutator, "First Layer");

    expect(test.getState().shapes).toHaveLength(1);
    const newLayer = await addLayer(test.mutator, "First Layer");

    expect(newLayer).toEqual({
      name: "First Layer (1)",
      type: "sprite",
      translate: [0, 0],
      mutationVectors: [],
      points: [],
    });
    expect(test.getState().shapes).toHaveLength(2);
    expect(test.getState().shapes[0]).toBe(newLayer);
  });

  it("supports setting data directly", async () => {
    const emptyImage = newDefinition();
    const test = mutationState(emptyImage);

    expect(test.getState().shapes).toHaveLength(0);
    const newLayer = await addLayer(test.mutator, "First Layer", null, {
      points: [
        [1, 2],
        [3, 4],
        [5, 6],
      ],
    });

    expect(newLayer).toEqual({
      name: "First Layer",
      type: "sprite",
      translate: [0, 0],
      mutationVectors: [],
      points: [
        [1, 2],
        [3, 4],
        [5, 6],
      ],
    });
    expect(test.getState().shapes).toHaveLength(1);
    expect(test.getState().shapes[0]).toBe(newLayer);
  });

  describe("tree placement", () => {
    it("sets an item to the top by default", async () => {
      const emptyImage = newDefinition();
      const test = mutationState(emptyImage);
      await addLayer(test.mutator, "First Layer");

      expect(test.getState().shapes).toHaveLength(1);
      const newLayer = await addLayer(test.mutator, "Second Layer");
      expect(test.getState().shapes).toHaveLength(2);
      expect(test.getState().shapes[0]).toBe(newLayer);
    });

    it("supports setting an item after another one", async () => {
      const emptyImage = newDefinition();
      const test = mutationState(emptyImage);
      await addLayer(test.mutator, "Second Layer");
      // New layers are put to the top by default
      await addLayer(test.mutator, "First Layer");

      expect(test.getState().shapes).toHaveLength(2);
      const newLayer = await addLayer(
        test.mutator,
        "Third Layer",
        "First Layer"
      );
      expect(test.getState().shapes).toHaveLength(3);
      expect(test.getState().shapes[1]).toBe(newLayer);
    });
  });
});

describe("updateVectorData", () => {
  describe("default naming", () => {
    it.concurrent.each([
      ["translate", "Translation"],
      ["rotate", "Rotation"],
      ["stretch", "Stretch"],
      ["opacity", "Opacity"],
      ["deform", "Deformation"],
    ])(
      "updates the default name on type change for %s",
      async (mutationType, newName) => {
        const emptyImage = newDefinition();
        const test = mutationState(emptyImage);
        const layer = await addLayer(test.mutator, "First Layer");
        await addVector(test.mutator, layer, "New Mutator");
        const onRename = jest.fn();

        const result = updateVectorData(
          test.getState(),
          "New Mutator",
          (vector) => ({
            ...vector,
            type: mutationType as MutationVector["type"],
            radius: 10,
          }),
          onRename
        );

        expect(result.shapes[0].mutationVectors[0].name).toEqual(newName);
        expect(onRename).toHaveBeenCalledWith(newName);
      }
    );

    it.concurrent.each([
      ["translate", "Translation"],
      ["rotate", "Rotation"],
      ["stretch", "Stretch"],
      ["opacity", "Opacity"],
      ["deform", "Deformation"],
    ])(
      "updates the default name on type change for %s with counter",
      async (mutationType, newName) => {
        const emptyImage = newDefinition();
        const test = mutationState(emptyImage);
        const layer = await addLayer(test.mutator, "First Layer");
        await addVector(test.mutator, layer, "New Mutator (213)");
        const onRename = jest.fn();

        const result = updateVectorData(
          test.getState(),
          "New Mutator (213)",
          (vector) => ({
            ...vector,
            type: mutationType as MutationVector["type"],
            radius: 10,
          }),
          onRename
        );

        expect(result.shapes[0].mutationVectors[0].name).toEqual(newName);
        expect(onRename).toHaveBeenCalledWith(newName);
      }
    );
  });
});
