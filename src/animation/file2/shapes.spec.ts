import { Vec2 } from "geppetto-player";
import { newFile } from "./new";
import {
  addFolder,
  AddFolderDetails,
  addPoint,
  addShape,
  AddShapeDetails,
  deletePoint,
  movePoint,
  removeShape,
  rename,
  toggleVisibility,
} from "./shapes";
import {
  fileBuilder,
  getMutationIdByName,
  getShapeFolderIdByName,
  getShapeIdByName,
} from "./testFileBuilder";
import { GeppettoImage } from "./types";

describe("shapes", () => {
  describe("addShape", () => {
    it("creates a shape as first element", () => {
      const file = newFile();

      const result: AddShapeDetails | {} = {};
      const image = addShape("New shape", undefined, result)(file);
      expect(image.layerHierarchy["0"]).toEqual({
        type: "layer",
        parentId: "root",
      });

      expect(result).toHaveProperty("layer", {
        name: "New shape",
        visible: true,
        points: [],
        translate: [0, 0],
      });
      expect(result).toHaveProperty("id", "0");
    });

    describe("positioning", () => {
      it("can place a shape after another", () => {
        const file = newFile();
        const firstShape = addShape("New shape")(file);

        const result: AddShapeDetails | {} = {};
        const image = addShape(
          "New shape",
          {
            after: "0",
          },
          result
        )(firstShape);

        expect(image.layerHierarchy[1]).toEqual({
          parentId: "root",
          type: "layer",
        });

        expect(result).toHaveProperty("layer", {
          name: "New shape (1)",
          visible: true,
          points: [],
          translate: [0, 0],
        });
      });
    });

    describe("naming", () => {
      it("makes a name unique if start suggestion is already taken", () => {
        const file = fileBuilder()
          .addShape("New shape")
          .addShape("New shape")
          .build();

        const result: AddShapeDetails | {} = {};
        addShape(
          "New shape",
          {
            after: "0",
          },
          result
        )(file);

        expect(result).toHaveProperty("layer", {
          name: "New shape (2)",
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
      const image = addFolder("New folder", undefined, resultDetails)(file);

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
        const firstFolder = addFolder("New folder")(file);

        const resultDetails: AddFolderDetails = {} as AddFolderDetails;
        const result = addFolder(
          "New folder",
          {
            after: "0",
          },
          resultDetails
        )(firstFolder);

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
        const firstFolder = addFolder("New shape")(file);
        const resultDetails: AddFolderDetails = {} as AddFolderDetails;
        const result = addFolder(
          "New folder",
          {
            parent: "0",
          },
          resultDetails
        )(firstFolder);

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
        const firstFolder = addFolder("Folder 1")(file);
        const nestedFolder = addFolder("Folder 2", {
          parent: "0",
        })(firstFolder);

        const resultDetails: AddFolderDetails = {} as AddFolderDetails;
        const result = addFolder(
          "New folder",
          {
            parent: "0",
            after: "1",
          },
          resultDetails
        )(nestedFolder);

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

  describe("visibility", () => {
    describe("layer", () => {
      it("toggles from visible to hidden", () => {
        const file = fileBuilder().addShape("MyLayer").build();
        const layerId = getShapeIdByName(file, "MyLayer");

        const updatedFile = toggleVisibility(layerId)(file);

        expect(file.layers[layerId].visible).toBe(true);
        expect(updatedFile.layers[layerId].visible).toBe(false);
      });

      it("toggles from hidden to visible", () => {
        const file = fileBuilder().addShape("MyLayer").build();
        const layerId = getShapeIdByName(file, "MyLayer");
        const startFile = toggleVisibility(layerId)(file);

        const updatedFile = toggleVisibility(layerId)(startFile);

        expect(startFile.layers[layerId].visible).toBe(false);
        expect(updatedFile.layers[layerId].visible).toBe(true);
      });
    });

    describe("folder", () => {
      it("toggles from visible to hidden", () => {
        const file = fileBuilder().addFolder("My Folder").build();
        const folderId = getShapeFolderIdByName(file, "My Folder");

        const updatedFile = toggleVisibility(folderId)(file);

        expect(file.layerFolders[folderId].visible).toBe(true);
        expect(updatedFile.layerFolders[folderId].visible).toBe(false);
      });

      it("toggles from hidden to visible", () => {
        const file = fileBuilder().addFolder("My Folder").build();
        const folderId = getShapeFolderIdByName(file, "My Folder");
        const startFile = toggleVisibility(folderId)(file);

        const updatedFile = toggleVisibility(folderId)(startFile);

        expect(startFile.layerFolders[folderId].visible).toBe(false);
        expect(updatedFile.layerFolders[folderId].visible).toBe(true);
      });
    });
  });
});

describe("rename", () => {
  const fileBuild = fileBuilder();
  fileBuild.addFolder("folder1");
  fileBuild.addShape("shape1", "folder1");
  fileBuild.addMutation("Movement", "translate", { radius: -1 }, "shape1");

  it("changes the name of a shape", () => {
    const file = fileBuild.build();
    const shapeId = getShapeIdByName(file, "shape1");

    const newFile = rename(shapeId, "layer", "newShapeName")(file);
    expect(newFile.layers[shapeId].name).toEqual("newShapeName");
  });

  it("changes the name of a folder", () => {
    const file = fileBuild.build();
    const folderId = getShapeFolderIdByName(file, "folder1");

    const newFile = rename(folderId, "layerFolder", "newFolderName")(file);
    expect(newFile.layerFolders[folderId].name).toEqual("newFolderName");
  });

  it("changes the name of a mutation", () => {
    const file = fileBuild.build();
    const mutationId = getMutationIdByName(file, "Movement");

    const newFile = rename(mutationId, "mutation", "UpdatedMovement")(file);
    expect(newFile.mutations[mutationId].name).toEqual("UpdatedMovement");
  });
});

describe("addPoint", () => {
  const fileBuild = fileBuilder();

  it("adds a point to a layer", () => {
    const file = fileBuild.addShape("My Layer").build();
    const layerId = getShapeIdByName(file, "My Layer");

    const result = addPoint(file, layerId, [50, 10]);
    expect(result.layers[layerId].points).toEqual([[50, 10]]);
  });
});

const addPoints = (
  file: GeppettoImage,
  layerId: string,
  points: Vec2[]
): GeppettoImage =>
  points.reduce<GeppettoImage>(
    (image, current) => addPoint(image, layerId, current),
    file
  );

describe("deletePoint", () => {
  const fileBuild = fileBuilder();

  it("adds a point to a layer", () => {
    const file = fileBuild.addShape("My Layer").build();
    const layerId = getShapeIdByName(file, "My Layer");
    const startFile = addPoints(file, layerId, [
      [50, 10],
      [40, 10],
      [30, 10],
    ]);

    const result = deletePoint(startFile, layerId, [40, 10]);

    expect(result.layers[layerId].points).toEqual([
      [50, 10],
      [30, 10],
    ]);
  });
});

describe("movePoint", () => {
  const fileBuild = fileBuilder();

  it("updates location of a point", () => {
    const file = fileBuild.addShape("My Layer").build();
    const layerId = getShapeIdByName(file, "My Layer");
    const startFile = addPoints(file, layerId, [
      [50, 10],
      [40, 10],
      [30, 10],
    ]);

    const result = movePoint(startFile, layerId, [40, 10], [45, 6]);

    expect(result.layers[layerId].points).toEqual([
      [50, 10],
      [45, 6],
      [30, 10],
    ]);
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
