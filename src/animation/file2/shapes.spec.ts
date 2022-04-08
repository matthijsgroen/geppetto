import { newFile } from "./new";
import { addFolder, addShape } from "./shapes";

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
      it.skip("can place a folder after another", () => {
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

      it.skip("can place a folder inside another", () => {
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
});
