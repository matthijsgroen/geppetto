import { newFile } from "./new";
import { addFolder, AddFolderDetails, addShape, removeShape } from "./shapes";
import {
  fileBuilder,
  getMutationIdByName,
  getShapeIdByName,
} from "./testFileBuilder";

describe("shapes", () => {
  describe("addShape", () => {
    it("creates a shape as first element", () => {
      const file = newFile();

      const [image, result, newId] = addShape(file, "New shape");
      expect(image.layerHierarchy["0"]).toEqual({
        type: "layer",
        parentId: "root",
      });

      expect(result).toEqual({
        name: "New shape",
        visible: true,
        points: [],
        translate: [0, 0],
      });
      expect(newId).toEqual("0");
    });

    describe("positioning", () => {
      it("can place a shape after another", () => {
        const file = newFile();
        const [firstShape] = addShape(file, "New shape");

        const [result, shape] = addShape(firstShape, "New shape", {
          after: "0",
        });

        expect(result.layerHierarchy[1]).toEqual({
          parentId: "root",
          type: "layer",
        });

        expect(shape).toEqual({
          name: "New shape (1)",
          visible: true,
          points: [],
          translate: [0, 0],
        });
      });
    });
  });

  describe("addFolder", () => {
    it("creates a folder as first element", () => {
      const file = newFile();

      const resultDetails: AddFolderDetails = {} as AddFolderDetails;
      const image = addFolder(file, "New folder", undefined, resultDetails);
      expect(image.layerHierarchy[0]).toEqual({
        parentId: "root",
        type: "layerFolder",
      });

      expect(resultDetails.folder).toEqual({
        name: "New folder",
        collapsed: false,
        visible: true,
      });
    });

    describe("positioning", () => {
      it("can place a folder after another", () => {
        const file = newFile();
        const firstFolder = addFolder(file, "New folder");

        const resultDetails: AddFolderDetails = {} as AddFolderDetails;
        const result = addFolder(
          firstFolder,
          "New folder",
          {
            after: "0",
          },
          resultDetails
        );

        expect(result.layerHierarchy[1]).toEqual({
          parentId: "root",
          type: "layerFolder",
        });

        expect(resultDetails.folder).toEqual({
          name: "New folder (1)",
          visible: true,
          collapsed: false,
        });
      });

      it("can place a folder inside another", () => {
        const file = newFile();
        const firstFolder = addFolder(file, "New shape");
        const resultDetails: AddFolderDetails = {} as AddFolderDetails;
        const result = addFolder(
          firstFolder,
          "New folder",
          {
            parent: "0",
          },
          resultDetails
        );

        expect(result.layerHierarchy[resultDetails.id]).toEqual({
          parentId: "0",
          type: "layerFolder",
        });

        expect(resultDetails.folder).toEqual({
          name: "New folder",
          visible: true,
          collapsed: false,
        });
      });

      it("can place a folder after child inside another", () => {
        const file = newFile();
        const firstFolder = addFolder(file, "Folder 1");
        const nestedFolder = addFolder(firstFolder, "Folder 2", {
          parent: "0",
        });

        const resultDetails: AddFolderDetails = {} as AddFolderDetails;
        const result = addFolder(
          nestedFolder,
          "New folder",
          {
            parent: "0",
            after: "1",
          },
          resultDetails
        );

        expect(result.layerHierarchy[resultDetails.id]).toEqual({
          parentId: "0",
          type: "layerFolder",
        });

        expect(resultDetails.folder).toEqual({
          name: "New folder",
          visible: true,
          collapsed: false,
        });
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
      const mutationId = getMutationIdByName(file, "Movement");
      const shapeId = getShapeIdByName(file, "shape1");

      const result = removeShape(mutationId)(file);

      expect(result.layerHierarchy[shapeId].children).toEqual([]);
      expect(result.layerHierarchy[mutationId]).toBeUndefined();
      expect(result.mutations[mutationId]).toBeUndefined();
      expect(result.defaultFrame[mutationId]).toBeUndefined();
    });
  });
});
