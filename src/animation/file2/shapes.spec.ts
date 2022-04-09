import { newFile } from "./new";
import { addFolder, addShape } from "./shapes";
import { TreeNode } from "./types";

const getChild = <T extends string>(
  node: TreeNode<T>,
  [head, ...tail]: number[]
): TreeNode<T> | undefined =>
  head !== undefined
    ? node.children
      ? getChild(node.children[head], tail)
      : undefined
    : node;

describe("shapes", () => {
  describe("addShape", () => {
    it("creates a shape as first element", () => {
      const file = newFile();

      const [image, result] = addShape(file, "New shape");
      expect(image.layerHierarchy[0]).toEqual({
        id: "0",
        type: "layer",
      });

      expect(result).toEqual({
        name: "New shape",
        visible: true,
        points: [],
        translate: [0, 0],
      });
    });

    describe("positioning", () => {
      it("can place a shape after another", () => {
        const file = newFile();
        const [firstShape] = addShape(file, "New shape");

        const [result, shape] = addShape(firstShape, "New shape", {
          after: "0",
        });

        expect(result.layerHierarchy[1]).toEqual({
          id: "1",
          type: "layer",
        });

        expect(shape).toEqual({
          name: "New shape",
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

      const [image, result] = addFolder(file, "New folder");
      expect(image.layerHierarchy[0]).toEqual({
        id: "0",
        type: "layerFolder",
      });

      expect(result).toEqual({
        name: "New folder",
        collapsed: false,
        visible: true,
      });
    });

    describe("positioning", () => {
      it("can place a folder after another", () => {
        const file = newFile();
        const [firstFolder] = addFolder(file, "New folder");

        const [result, folder] = addFolder(firstFolder, "New folder", {
          after: "0",
        });

        expect(result.layerHierarchy[1]).toEqual({
          id: "1",
          type: "layerFolder",
        });

        expect(folder).toEqual({
          name: "New folder",
          visible: true,
          collapsed: false,
        });
      });

      it("can place a folder inside another", () => {
        const file = newFile();
        const [firstFolder] = addFolder(file, "New shape");

        const [result, folder] = addFolder(firstFolder, "New folder", {
          parent: "0",
        });

        expect(getChild(result.layerHierarchy[0], [0])).toEqual({
          id: "1",
          type: "layerFolder",
        });

        expect(folder).toEqual({
          name: "New folder",
          visible: true,
          collapsed: false,
        });
      });

      it("can place a folder after child inside another", () => {
        const file = newFile();
        const [firstFolder] = addFolder(file, "Folder 1");
        const [nestedFolder] = addFolder(firstFolder, "Folder 2", {
          parent: "0",
        });

        const [result, folder] = addFolder(nestedFolder, "New folder", {
          parent: "0",
          after: "1",
        });

        expect(getChild(result.layerHierarchy[0], [1])).toEqual({
          id: "2",
          type: "layerFolder",
        });

        expect(folder).toEqual({
          name: "New folder",
          visible: true,
          collapsed: false,
        });
      });
    });
  });
});
