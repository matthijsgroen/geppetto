import { fileBuilder, mutationIdByName } from "./testFileBuilder";
import { vectorPositions } from "./vectorPositions";

const fileWithFolderLayers = () =>
  fileBuilder().addFolder("folder").addShape("shape", "folder");

describe("vectorPositions", () => {
  it("calculates the position without parents", () => {
    const file = fileWithFolderLayers()
      .addMutation(
        "mutation",
        "translate",
        { radius: -1, origin: [50, 30] },
        "folder"
      )
      .result();

    const mutId = mutationIdByName(file, "mutation");

    const positions = vectorPositions(file.mutations, file.layerHierarchy, {
      [mutId]: [40, 30],
    });

    expect(positions).toEqual({
      [mutId]: [50, 30],
    });
  });

  describe("translate", () => {
    it("calculates the position with translation parents (same layer)", () => {
      const file = fileWithFolderLayers()
        .addMutation("rotate", "rotate", { origin: [10, 40] }, "shape")
        .addMutation(
          "translate",
          "translate",
          { origin: [50, 30], radius: -1 },
          "shape"
        )
        .result();

      const transMutId = mutationIdByName(file, "translate");
      const rotateMutId = mutationIdByName(file, "rotate");

      const positions = vectorPositions(file.mutations, file.layerHierarchy, {
        [transMutId]: [40, 30],
        [rotateMutId]: [90, 0],
      });

      expect(positions).toEqual({
        [transMutId]: [50, 30],
        [rotateMutId]: [50, 70],
      });
    });

    it("calculates the position with translation parents (parent folder)", () => {
      const file = fileWithFolderLayers()
        .addMutation("rotate", "rotate", { origin: [10, 40] }, "shape")
        .addMutation(
          "translate",
          "translate",
          { origin: [50, 30], radius: -1 },
          "folder"
        )
        .result();

      const transMutId = mutationIdByName(file, "translate");
      const rotateMutId = mutationIdByName(file, "rotate");

      const positions = vectorPositions(file.mutations, file.layerHierarchy, {
        [transMutId]: [40, 30],
        [rotateMutId]: [90, 0],
      });

      expect(positions).toEqual({
        [transMutId]: [50, 30],
        [rotateMutId]: [50, 70],
      });
    });

    it("calculates the position with stacked translation parents", () => {
      const file = fileWithFolderLayers()
        .addMutation("rotate", "rotate", { origin: [10, 40] }, "shape")
        .addMutation(
          "translate2",
          "translate",
          { origin: [20, 30], radius: -1 },
          "shape"
        )
        .addMutation(
          "translate",
          "translate",
          { origin: [50, 30], radius: -1 },
          "folder"
        )
        .result();

      const transMutId = mutationIdByName(file, "translate");
      const trans2MutId = mutationIdByName(file, "translate2");
      const rotateMutId = mutationIdByName(file, "rotate");

      const positions = vectorPositions(file.mutations, file.layerHierarchy, {
        [transMutId]: [40, 30],
        [trans2MutId]: [10, 20],
        [rotateMutId]: [90, 0],
      });

      expect(positions).toEqual({
        [transMutId]: [50, 30],
        [trans2MutId]: [60, 60],
        [rotateMutId]: [60, 90],
      });
    });

    it("calculates the position with translation parents (radius)", () => {
      const file = fileWithFolderLayers()
        .addShape("shape2", "folder")
        .addMutation("rotate", "rotate", { origin: [10, 40] }, "shape")
        .addMutation("rotate2", "rotate", { origin: [50, 50] }, "shape2")
        .addMutation(
          "translate",
          "translate",
          { origin: [10, 30], radius: 20 },
          "folder"
        )
        .result();

      const transMutId = mutationIdByName(file, "translate");
      const rotateMutId = mutationIdByName(file, "rotate");
      const rotate2MutId = mutationIdByName(file, "rotate2");

      const positions = vectorPositions(file.mutations, file.layerHierarchy, {
        [transMutId]: [40, 30],
        [rotateMutId]: [90, 0],
        [rotate2MutId]: [-90, 0],
      });

      expect(positions).toEqual({
        [transMutId]: [10, 30],
        [rotateMutId]: [10 + 40, 40 + 30], // translated
        [rotate2MutId]: [50, 50], // not affected
      });
    });
  });

  describe("rotate", () => {
    it("calculates the position with rotation parents", () => {
      const file = fileWithFolderLayers()
        .addMutation(
          "translate",
          "translate",
          { origin: [50, 30], radius: -1 },
          "shape"
        )
        .addMutation("rotate", "rotate", { origin: [50, 20] }, "shape")
        .result();

      const transMutId = mutationIdByName(file, "translate");
      const rotateMutId = mutationIdByName(file, "rotate");

      const positions = vectorPositions(file.mutations, file.layerHierarchy, {
        [transMutId]: [40, 30],
        [rotateMutId]: [90, 0],
      });

      expect(positions).toEqual({
        [transMutId]: [40, 20],
        [rotateMutId]: [50, 20],
      });
    });
  });

  describe("deform", () => {
    it("calculates the position with deform parents", () => {
      const file = fileWithFolderLayers()
        .addShape("shape2", "folder")
        .addMutation("rotate", "rotate", { origin: [10, 40] }, "shape")
        .addMutation("rotate2", "rotate", { origin: [50, 50] }, "shape2")
        .addMutation(
          "deform",
          "deform",
          { origin: [10, 30], radius: 20 },
          "folder"
        )
        .result();

      const deformMutId = mutationIdByName(file, "deform");
      const rotateMutId = mutationIdByName(file, "rotate");
      const rotate2MutId = mutationIdByName(file, "rotate2");

      const positions = vectorPositions(file.mutations, file.layerHierarchy, {
        [deformMutId]: [40, 30],
        [rotateMutId]: [90, 0],
        [rotate2MutId]: [-90, 0],
      });

      expect(positions).toEqual({
        [deformMutId]: [10, 30],
        [rotateMutId]: [10 + 40 * 0.5, 40 + 30 * 0.5], // translated
        [rotate2MutId]: [50, 50], // not affected
      });
    });
  });
});
