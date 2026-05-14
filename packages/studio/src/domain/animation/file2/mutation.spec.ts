import type { TranslationVector } from "@geppetto/types";
import { type MutationVector } from "@geppetto/types";

import {
  addMutation,
  type AddMutationDetails,
  hasMutations,
  hasRadius,
  isShapeMutationVector,
  setMutationOrigin,
  toggleMutationRadius,
  updateMutationRadius,
  updateMutationValue,
} from "./mutation";
import {
  fileBuilder,
  getMutationIdByName,
  getShapeFolderIdByName,
  getShapeIdByName,
} from "./testFileBuilder";

describe("addMutation", () => {
  describe("default add behavior", () => {
    const fileWithFoldersAndLayers = fileBuilder();
    fileWithFoldersAndLayers.addFolder("folder1");
    fileWithFoldersAndLayers.addShape("shape1", "folder1");

    describe("adding mutation to layer", () => {
      it("adds mutation to layer", () => {
        const startFile = fileWithFoldersAndLayers.build();
        const shapeId = getShapeIdByName(startFile, "shape1");
        const folderId = getShapeFolderIdByName(startFile, "folder1");

        type MutationType = MutationVector["type"];
        const addDetails = {} as AddMutationDetails<MutationType>;
        const result = addMutation<MutationType>(
          startFile,
          "Mutation1",
          "translate",
          {},
          { parent: shapeId },
          addDetails
        );

        expect(addDetails.mutation).toHaveProperty("name", "Mutation1");
        expect(addDetails.mutation).toHaveProperty("type", "translate");

        expect(result.layerHierarchy[shapeId]).toEqual({
          parentId: folderId,
          type: "layer",
          children: [addDetails.id],
        });
        expect(result.layerHierarchy[addDetails.id]).toEqual({
          parentId: shapeId,
          type: "mutation",
        });

        expect(result.mutations[addDetails.id]).toEqual({
          type: "translate",
          name: "Mutation1",
          origin: [0, 0],
          radius: -1,
        });
        expect(result.defaultFrame[addDetails.id]).toEqual([0, 0]);
      });
    });
  });
});

describe("updateMutationValue", () => {
  it("sets new vec2 value", () => {
    const file = fileBuilder()
      .addShape("foo")
      .addMutation(
        "mutation",
        "translate",
        { origin: [0, 0], radius: -1 },
        "foo"
      )
      .build();

    const mutationId = getMutationIdByName(file, "mutation");

    const updatedFile = updateMutationValue(mutationId, [30, 20])(file);

    expect(file.defaultFrame[mutationId]).toEqual([0, 0]);
    expect(updatedFile.defaultFrame[mutationId]).toEqual([30, 20]);
  });
});

describe("hasRadius", () => {
  it.each<{ vector: MutationVector; result: boolean }>([
    {
      vector: {
        type: "translate",
        name: "TranslationVector",
        origin: [0, 0],
        radius: -1,
      },
      result: true,
    },
    {
      vector: {
        type: "deform",
        name: "DeformationVector",
        origin: [0, 0],
        radius: 10,
      },
      result: true,
    },
    {
      vector: { type: "opacity", name: "OpacityVector", origin: [5, 5] },
      result: false,
    },
    {
      vector: { type: "rotate", name: "RotationVector", origin: [0, 0] },
      result: false,
    },
    {
      vector: { type: "stretch", name: "StretchVector", origin: [0, 0] },
      result: false,
    },
  ])("returns $result for a $vector.name", ({ result, vector }) => {
    expect(hasRadius(vector)).toEqual(result);
  });
});

describe("isShapeMutationVector", () => {
  it.each<{ vector: MutationVector; result: boolean }>([
    {
      vector: {
        type: "translate",
        name: "TranslationVector",
        origin: [0, 0],
        radius: -1,
      },
      result: true,
    },
    {
      vector: {
        type: "deform",
        name: "DeformationVector",
        origin: [0, 0],
        radius: 10,
      },
      result: true,
    },
    {
      vector: { type: "opacity", name: "OpacityVector", origin: [5, 5] },
      result: true,
    },
    {
      vector: { type: "rotate", name: "RotationVector", origin: [0, 0] },
      result: true,
    },
    {
      vector: { type: "stretch", name: "StretchVector", origin: [0, 0] },
      result: true,
    },
    {
      vector: { type: "colorize", name: "ColorizeVector", origin: [0, 0] },
      result: false,
    },
    {
      vector: { type: "lightness", name: "LightnessVector", origin: [0, 0] },
      result: false,
    },
    {
      vector: { type: "saturation", name: "SaturationVector", origin: [0, 0] },
      result: false,
    },
  ])("returns $result for a $vector.name", ({ result, vector }) => {
    expect(isShapeMutationVector(vector)).toEqual(result);
  });
});

describe("hasMutations", () => {
  it("returns false for files without mutations", () => {
    const file = fileBuilder().build();
    expect(hasMutations(file)).toBe(false);
  });

  it("returns true for files with mutations", () => {
    const file = fileBuilder()
      .addShape("shape1")
      .addMutation("mutation1", "translate", { radius: -1 }, "shape1")
      .build();
    expect(hasMutations(file)).toBe(true);
  });
});

describe("updateMutationValue", () => {
  it("updates the mutation value", () => {
    const file = fileBuilder()
      .addShape("shape1")
      .addMutation("mutation1", "translate", { radius: -1 }, "shape1")
      .build();
    const mutationId = getMutationIdByName(file, "mutation1");

    const updatedFile = updateMutationValue(mutationId, [10, 20])(file);

    expect(updatedFile.defaultFrame[mutationId]).toEqual([10, 20]);
  });

  describe("when mutation does not exist", () => {
    it("does not update the file", () => {
      const file = fileBuilder()
        .addShape("shape1")
        .addMutation("mutation1", "translate", { radius: -1 }, "shape1")
        .build();

      const updatedFile = updateMutationValue(
        "non-existing-mutation",
        [10, 20]
      )(file);

      expect(updatedFile).toBe(file);
    });
  });
});

describe("updateMutationRadius", () => {
  it("updates the mutation radius", () => {
    const file = fileBuilder()
      .addShape("shape1")
      .addMutation("mutation1", "translate", { radius: 5 }, "shape1")
      .build();
    const mutationId = getMutationIdByName(file, "mutation1");

    const updatedFile = updateMutationRadius(mutationId, 15)(file);

    expect(
      (updatedFile.mutations[mutationId] as TranslationVector).radius
    ).toBe(15);
  });

  describe("when mutation does not have a radius", () => {
    it("does not update the file", () => {
      const file = fileBuilder()
        .addShape("shape1")
        .addMutation("mutation1", "opacity", {}, "shape1")
        .build();
      const mutationId = getMutationIdByName(file, "mutation1");

      const updatedFile = updateMutationRadius(mutationId, 15)(file);

      expect(updatedFile).toBe(file);
    });
  });
});

describe("toggleMutationRadius", () => {
  it("enables the mutation radius", () => {
    const file = fileBuilder()
      .addShape("shape1")
      .addMutation("mutation1", "translate", { radius: -1 }, "shape1")
      .build();
    const mutationId = getMutationIdByName(file, "mutation1");

    const updatedFile = toggleMutationRadius(mutationId, true)(file);

    expect(
      (updatedFile.mutations[mutationId] as TranslationVector).radius
    ).toBe(10);
  });

  it("disables the mutation radius", () => {
    const file = fileBuilder()
      .addShape("shape1")
      .addMutation("mutation1", "translate", { radius: 20 }, "shape1")
      .build();
    const mutationId = getMutationIdByName(file, "mutation1");

    const updatedFile = toggleMutationRadius(mutationId, false)(file);

    expect(
      (updatedFile.mutations[mutationId] as TranslationVector).radius
    ).toBe(-1);
  });

  describe("when mutation does not have a radius", () => {
    it("does not update the file", () => {
      const file = fileBuilder()
        .addShape("shape1")
        .addMutation("mutation1", "opacity", {}, "shape1")
        .build();
      const mutationId = getMutationIdByName(file, "mutation1");

      const updatedFile = toggleMutationRadius(mutationId, true)(file);

      expect(updatedFile).toBe(file);
    });
  });
});

describe("setMutationOrigin", () => {
  it("sets the mutation origin", () => {
    const file = fileBuilder()
      .addShape("shape1")
      .addMutation("mutation1", "translate", { radius: -1 }, "shape1")
      .build();
    const mutationId = getMutationIdByName(file, "mutation1");

    const updatedFile = setMutationOrigin(mutationId, [15, 25])(file);

    expect(updatedFile.mutations[mutationId].origin).toEqual([15, 25]);
  });
});
