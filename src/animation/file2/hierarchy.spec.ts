import { addInHierarchy } from "./hierarchy";
import { TreeNode } from "./types";

type TreeItem = TreeNode<"item">;

describe("hierarchy", () => {
  describe("addInHierarchy", () => {
    const hierarchy: TreeItem[] = [
      { id: "0", type: "item" },
      { id: "2", type: "item" },
    ];

    it("adds an item in front by default", () => {
      const result = addInHierarchy(hierarchy, { id: "1", type: "item" });
      expect(result).toEqual([
        { id: "1", type: "item" },
        { id: "0", type: "item" },
        { id: "2", type: "item" },
      ]);
    });

    it.only("can place item after another", () => {
      const result = addInHierarchy(
        hierarchy,
        { id: "1", type: "item" },
        { after: "0" }
      );
      expect(result).toEqual([
        { id: "", type: "root", children: ["0", "1", "2"] },
        { id: "0", type: "item" },
        { id: "1", type: "item" },
        { id: "2", type: "item" },
      ]);
    });

    it("can place item inside another", () => {
      const result = addInHierarchy(
        hierarchy,
        { id: "1", type: "item" },
        { parent: "2" }
      );
      expect(result).toEqual([
        { id: "0", type: "item" },
        { id: "2", type: "item", children: ["1"] },
        { id: "1", type: "item", parentId: "2" },
      ]);
    });

    it("can place item inside another (multiple levels deep)", () => {
      const init = addInHierarchy(
        hierarchy,
        { id: "1", type: "item" },
        { parent: "2" }
      );
      const result = addInHierarchy(
        init,
        { id: "3", type: "item" },
        { parent: "1" }
      );
      expect(result).toEqual([
        { id: "0", type: "item" },
        {
          id: "2",
          type: "item",
          children: [
            { id: "1", type: "item", children: [{ id: "3", type: "item" }] },
          ],
        },
      ]);
    });

    it("can place item inside another and after another", () => {
      const hierarchy: TreeItem[] = [
        { id: "0", type: "item" },
        {
          id: "2",
          type: "item",
          children: [
            { id: "4", type: "item" },
            { id: "5", type: "item" },
          ],
        },
      ];

      const result = addInHierarchy(
        hierarchy,
        { id: "1", type: "item" },
        { parent: "2", after: "4" }
      );
      expect(result).toEqual([
        { id: "0", type: "item" },
        {
          id: "2",
          type: "item",
          children: [
            { id: "4", type: "item" },
            { id: "1", type: "item" },
            { id: "5", type: "item" },
          ],
        },
      ]);
    });
  });
});
