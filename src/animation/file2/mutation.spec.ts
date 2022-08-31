import {
  addMutation,
  AddMutationDetails,
  hasRadius,
  isShapeMutationVector,
  updateMutationValue,
} from "./mutation";
import {
  fileBuilder,
  getMutationIdByName,
  getShapeFolderIdByName,
  getShapeIdByName,
} from "./testFileBuilder";
import { MutationVector } from "./types";

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

        const addDetails = {} as AddMutationDetails<"translate">;
        const result = addMutation(
          startFile,
          "Mutation1",
          "translate",
          { radius: -1 },
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
