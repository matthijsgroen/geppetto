import { addInHierarchy } from "./hierarchy";
import { Hierarchy } from "./types";

describe("hierarchy", () => {
  describe("addInHierarchy", () => {
    const hierarchy: Hierarchy<"item"> = {
      root: { type: "root", children: ["0", "2"] },
      "0": { type: "item", parentId: "root" },
      "2": { type: "item", parentId: "root" },
    };

    it("adds an item in front by default", () => {
      const [result, newId] = addInHierarchy(hierarchy, { type: "item" });
      expect(result).toEqual({
        root: { type: "root", children: ["1", "0", "2"] },
        "0": { type: "item", parentId: "root" },
        "2": { type: "item", parentId: "root" },
        "1": { type: "item", parentId: "root" },
      });
      expect(newId).toEqual("1");
    });

    it("can place item after another", () => {
      const [result, newId] = addInHierarchy(
        hierarchy,
        { type: "item" },
        { after: "0" }
      );
      expect(result).toEqual({
        root: { type: "root", children: ["0", "1", "2"] },
        "0": { type: "item", parentId: "root" },
        "2": { type: "item", parentId: "root" },
        "1": { type: "item", parentId: "root" },
      });
      expect(newId).toEqual("1");
    });

    it("can place item inside another", () => {
      const [result, newId] = addInHierarchy(
        hierarchy,
        { type: "item" },
        { parent: "2" }
      );
      expect(result).toEqual({
        root: { type: "root", children: ["0", "2"] },
        "0": { type: "item", parentId: "root" },
        "2": { type: "item", parentId: "root", children: ["1"] },
        "1": { type: "item", parentId: "2" },
      });
      expect(newId).toEqual("1");
    });

    it("can place item inside another (multiple levels deep)", () => {
      const [init] = addInHierarchy(
        hierarchy,
        { type: "item" },
        { parent: "2" }
      );
      const [result] = addInHierarchy(init, { type: "item" }, { parent: "1" });
      expect(result).toEqual({
        root: { type: "root", children: ["0", "2"] },
        "0": { type: "item", parentId: "root" },
        "2": { type: "item", parentId: "root", children: ["1"] },
        "1": { type: "item", parentId: "2", children: ["3"] },
        "3": { type: "item", parentId: "1" },
      });
    });
  });
});
