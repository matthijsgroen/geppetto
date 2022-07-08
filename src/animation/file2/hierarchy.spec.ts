import {
  addInHierarchy,
  findInHierarchy,
  getPreviousOfType,
  moveInHierarchy,
  removeFromHierarchy,
  visit,
} from "./hierarchy";
import { Hierarchy } from "./types";

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
    const [init] = addInHierarchy(hierarchy, { type: "item" }, { parent: "2" });
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

describe("findInHierarchy", () => {
  const hierarchy: Hierarchy<"item"> = {
    root: { type: "root", children: ["0", "2"] },
    "0": { type: "item", parentId: "root" },
    "2": { type: "item", parentId: "root", children: ["1"] },
    "1": { type: "item", parentId: "2", children: ["3"] },
    "3": { type: "item", parentId: "1" },
  };

  it("retrieves element from hierarchy based on id", () => {
    const result = findInHierarchy(hierarchy, "1");
    expect(result).toEqual({ type: "item", parentId: "2", children: ["3"] });
  });
});

describe("removeFromHierarchy", () => {
  const hierarchy: Hierarchy<"item"> = {
    root: { type: "root", children: ["0", "2"] },
    "0": { type: "item", parentId: "root" },
    "2": { type: "item", parentId: "root", children: ["1"] },
    "1": { type: "item", parentId: "2", children: ["3"] },
    "3": { type: "item", parentId: "1" },
  };

  it("removes an item from the hierarchy", () => {
    const [result, removedItems] = removeFromHierarchy(hierarchy, "1");
    expect(result).toEqual({
      root: { type: "root", children: ["0", "2"] },
      "0": { type: "item", parentId: "root" },
      "2": { type: "item", parentId: "root" },
    });
    expect(removedItems).toEqual({
      "1": { type: "item", parentId: "2", children: ["3"] },
      "3": { type: "item", parentId: "1" },
    });
  });
});

describe("moveInHierarchy", () => {
  const hierarchy: Hierarchy<"item"> = {
    root: { type: "root", children: ["0", "2"] },
    "0": { type: "item", parentId: "root" },
    "2": { type: "item", parentId: "root", children: ["1"] },
    "1": { type: "item", parentId: "2", children: ["3"] },
    "3": { type: "item", parentId: "1" },
  };

  it("can move item to other folder", () => {
    const result = moveInHierarchy(hierarchy, "1", { parent: "0" });
    expect(result).toEqual({
      root: { type: "root", children: ["0", "2"] },
      "0": { type: "item", parentId: "root", children: ["1"] },
      "2": { type: "item", parentId: "root" },
      "1": { type: "item", parentId: "0", children: ["3"] },
      "3": { type: "item", parentId: "1" },
    });
  });

  it("can move item in list of children", () => {
    const result = moveInHierarchy(hierarchy, "3", { after: "1" });
    expect(result).toEqual({
      root: { type: "root", children: ["0", "2"] },
      "0": { type: "item", parentId: "root" },
      "2": { type: "item", parentId: "root", children: ["1", "3"] },
      "1": { type: "item", parentId: "2" },
      "3": { type: "item", parentId: "2" },
    });
  });

  it("can move item in list of children (multiple steps)", () => {
    const placeTogether = moveInHierarchy(hierarchy, "3", { after: "1" });
    const result = moveInHierarchy(placeTogether, "3", { before: "1" });
    expect(result).toEqual({
      root: { type: "root", children: ["0", "2"] },
      "0": { type: "item", parentId: "root" },
      "2": { type: "item", parentId: "root", children: ["3", "1"] },
      "1": { type: "item", parentId: "2" },
      "3": { type: "item", parentId: "2" },
    });
  });

  it("prevents moving the root", () => {
    const moveRoot = moveInHierarchy(hierarchy, "root", { parent: "1" });
    expect(moveRoot).toBe(hierarchy);
  });

  it("prevents moving item to its own children", () => {
    const moveToOwnChild = moveInHierarchy(hierarchy, "2", { parent: "1" });
    expect(moveToOwnChild).toBe(hierarchy);
  });

  it("prevents moving item to its own", () => {
    const moveToOwn = moveInHierarchy(hierarchy, "2", { parent: "2" });
    expect(moveToOwn).toBe(hierarchy);
  });
});

describe("visit", () => {
  const hierarchy: Hierarchy<"item" | "search"> = {
    root: { type: "root", children: ["0", "2"] },
    "0": { type: "item", parentId: "root" },
    "2": { type: "item", parentId: "root", children: ["3", "4", "5", "6"] },
    "3": { type: "search", parentId: "2" },
    "4": { type: "search", parentId: "2" },
    "5": { type: "item", parentId: "2", children: ["7", "8"] },
    "6": { type: "item", parentId: "2", children: ["9"] },
    "7": { type: "search", parentId: "5" },
    "8": { type: "item", parentId: "5" },
    "9": { type: "item", parentId: "6" },
  };

  it("will call the visit callback for each node in the tree", () => {
    let counter = 0;
    visit(hierarchy, () => {
      counter++;
    });
    expect(counter).toEqual(9);
  });

  it("will abort traversal when SKIP is returned", () => {
    let counter = 0;
    visit(hierarchy, () => {
      counter++;
      if (counter === 3) {
        return "SKIP";
      }
    });
    expect(counter).toEqual(3);
  });

  it("accepts a starting node", () => {
    let visitedIds: string[] = [];
    visit(
      hierarchy,
      (_node, nodeId) => {
        visitedIds.push(nodeId);
      },
      "6"
    );
    expect(visitedIds).toEqual(["6", "9"]);
  });
});

describe("getPreviousOfType", () => {
  const hierarchy: Hierarchy<"item" | "search"> = {
    root: { type: "root", children: ["0", "2"] },
    "0": { type: "item", parentId: "root" },
    "2": { type: "item", parentId: "root", children: ["3", "4", "5", "6"] },
    "3": { type: "search", parentId: "2" },
    "4": { type: "search", parentId: "2" },
    "5": { type: "item", parentId: "2", children: ["7", "8"] },
    "6": { type: "item", parentId: "2", children: ["9"] },
    "7": { type: "search", parentId: "5" },
    "8": { type: "item", parentId: "5" },
    "9": { type: "item", parentId: "6" },
  };

  it("looks in list of siblings", () => {
    const result = getPreviousOfType(hierarchy, "search", "5");
    expect(result).toEqual("4");
  });

  it("looks upwards in hierarchy", () => {
    const result = getPreviousOfType(hierarchy, "search", "7");
    expect(result).toEqual("4");
  });

  it("looks upwards in hierarchy (multiple times)", () => {
    const result = getPreviousOfType(hierarchy, "search", "9");
    expect(result).toEqual("4");
  });

  it("returns null when parent has no children", () => {
    const result = getPreviousOfType(hierarchy, "search", "9");
    expect(result).toEqual("4");
  });
});
