import { dragItem } from "./drag";
import {
  fileBuilder,
  getMutationIdByName,
  getShapeFolderIdByName,
  getShapeIdByName,
} from "./testFileBuilder";

describe("drag", () => {
  const fileWithFolderLayers = () =>
    fileBuilder()
      .addFolder("folder")
      .addShape("shape", "folder")
      .addMutation(
        "mutation",
        "translate",
        { radius: -1, origin: [50, 30] },
        "folder"
      )
      .addShape("shape2", "folder")
      .addMutation(
        "mutation2",
        "translate",
        { radius: -1, origin: [50, 30] },
        "shape2"
      );

  it("can drag a mutation", () => {
    const file = fileWithFolderLayers().build();

    const mutationId = getMutationIdByName(file, "mutation2");
    const result = dragItem(file, [40, 30], mutationId)(file);

    expect(result.mutations[mutationId].origin).toEqual([90, 60]);
  });

  it("can drag a shape with mutations", () => {
    const file = fileWithFolderLayers().build();

    const mutationId = getMutationIdByName(file, "mutation2");
    const shapeId = getShapeIdByName(file, "shape2");
    const result = dragItem(file, [40, 30], shapeId)(file);

    expect(result.layers[shapeId].translate).toEqual([40, 30]);
    expect(result.mutations[mutationId].origin).toEqual([90, 60]);
  });

  it("can drag a folder with multiple shapes and mutations", () => {
    const file = fileWithFolderLayers().build();

    const folderId = getShapeFolderIdByName(file, "folder");
    const shapeId = getShapeIdByName(file, "shape");
    const shapeId2 = getShapeIdByName(file, "shape2");
    const mutationId = getMutationIdByName(file, "mutation");
    const mutationId2 = getMutationIdByName(file, "mutation2");

    const result = dragItem(file, [20, 80], folderId)(file);

    expect(result.layers[shapeId].translate).toEqual([20, 80]);
    expect(result.layers[shapeId2].translate).toEqual([20, 80]);
    expect(result.mutations[mutationId].origin).toEqual([70, 110]);
    expect(result.mutations[mutationId2].origin).toEqual([70, 110]);
  });
});
