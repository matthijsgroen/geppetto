import { addMutation, AddMutationDetails } from "./mutation";
import {
  fileBuilder,
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
