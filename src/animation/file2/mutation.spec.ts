import { addMutation, AddMutationDetails, removeMutation } from "./mutation";
import {
  fileBuilder,
  mutationIdByName,
  shapeFolderIdByName,
  shapeIdByName,
} from "./testFileBuilder";

describe("addMutation", () => {
  describe("default add behavior", () => {
    const fileWithFoldersAndLayers = fileBuilder();
    fileWithFoldersAndLayers.addFolder("folder1");
    fileWithFoldersAndLayers.addShape("shape1", "folder1");

    describe("adding mutation to layer", () => {
      it("adds mutation to layer", () => {
        const startFile = fileWithFoldersAndLayers.build();
        const shapeId = shapeIdByName(startFile, "shape1");
        const folderId = shapeFolderIdByName(startFile, "folder1");

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

describe("removeMutation", () => {
  describe("default remove behavior", () => {
    const fileWithMutation = fileBuilder();
    fileWithMutation.addFolder("folder1");
    fileWithMutation.addShape("shape1", "folder1");
    fileWithMutation.addMutation(
      "Movement",
      "translate",
      { radius: -1 },
      "shape1"
    );

    it("removes all relevant data", () => {
      const file = fileWithMutation.build();
      const mutationId = mutationIdByName(file, "Movement");
      const shapeId = shapeIdByName(file, "shape1");

      const result = removeMutation(file, mutationId);

      expect(result.layerHierarchy[shapeId].children).toBeUndefined();
      expect(result.layerHierarchy[mutationId]).toBeUndefined();
      expect(result.mutations[mutationId]).toBeUndefined();
      expect(result.defaultFrame[mutationId]).toBeUndefined();
    });
  });
});
