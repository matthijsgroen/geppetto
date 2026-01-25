import { describe, it, expect } from "vitest";
import {
  isFormat2File,
  isShapeMutationVector,
  isColorMutationVector,
  isTreeNode,
  isRootNode,
  isLayerNode,
  isLayerFolderNode,
  isMutationNode,
  isControlTrack,
  isVisibilityTrack,
} from "./validators";
import type {
  GeppettoImage,
  MutationVector,
  TreeNode,
  RootNode,
  AnimationTrack,
} from "./index";

describe("validators", () => {
  describe("isFormat2File", () => {
    const validFile: GeppettoImage = {
      version: "2.0",
      metadata: {
        width: 2048,
        height: 1536,
        zoom: 1.0,
        pan: [0, 0],
      },
      layerHierarchy: {
        root: { type: "root", children: [] },
      },
      layers: {},
      mutations: {},
      layerFolders: {},
      defaultFrame: {},
      controlHierarchy: {
        root: { type: "root", children: [] },
      },
      controlFolders: {},
      controls: {},
      controlValues: {},
      animationHierarchy: {
        root: { type: "root", children: [] },
      },
      animations: {},
    };

    it("returns true for a valid version 2.0 file", () => {
      expect(isFormat2File(validFile)).toBe(true);
    });

    it("returns true for a valid version 2.1 file", () => {
      const file = { ...validFile, version: "2.1" };
      expect(isFormat2File(file)).toBe(true);
    });

    it("returns false for version 1.x file", () => {
      const file = { ...validFile, version: "1.0" };
      expect(isFormat2File(file)).toBe(false);
    });

    it("returns false for version 3.x file", () => {
      const file = { ...validFile, version: "3.0" };
      expect(isFormat2File(file)).toBe(false);
    });

    it("returns false for null", () => {
      expect(isFormat2File(null)).toBe(false);
    });

    it("returns false for undefined", () => {
      expect(isFormat2File(undefined)).toBe(false);
    });

    it("returns false for a string", () => {
      expect(isFormat2File("test")).toBe(false);
    });

    it("returns false for a number", () => {
      expect(isFormat2File(123)).toBe(false);
    });

    it("returns false for missing required fields", () => {
      const { metadata: _metadata, ...incomplete } = validFile;
      expect(isFormat2File(incomplete)).toBe(false);
    });

    it("returns false for invalid metadata", () => {
      const file = {
        ...validFile,
        metadata: { ...validFile.metadata, width: "invalid" },
      };
      expect(isFormat2File(file)).toBe(false);
    });

    it("returns false for invalid layer points", () => {
      const file = {
        ...validFile,
        layers: {
          "1": {
            name: "test",
            visible: true,
            points: [[1, 2, 3]], // Invalid - should be Vec2
            translate: [0, 0],
          },
        },
      };
      expect(isFormat2File(file)).toBe(false);
    });

    it("validates mutation vectors", () => {
      const file = {
        ...validFile,
        mutations: {
          "1": {
            name: "test",
            type: "deform",
            origin: [0, 0],
            radius: 10,
          },
        },
      };
      expect(isFormat2File(file)).toBe(true);
    });

    it("returns false for invalid mutation type", () => {
      const file = {
        ...validFile,
        mutations: {
          "1": {
            name: "test",
            type: "invalid",
            origin: [0, 0],
          },
        },
      };
      expect(isFormat2File(file)).toBe(false);
    });
  });

  describe("isShapeMutationVector", () => {
    it("returns true for deform mutation", () => {
      const mutation: MutationVector = {
        name: "test",
        type: "deform",
        origin: [0, 0],
        radius: 10,
      };
      expect(isShapeMutationVector(mutation)).toBe(true);
    });

    it("returns true for translate mutation", () => {
      const mutation: MutationVector = {
        name: "test",
        type: "translate",
        origin: [0, 0],
        radius: 10,
      };
      expect(isShapeMutationVector(mutation)).toBe(true);
    });

    it("returns true for rotate mutation", () => {
      const mutation: MutationVector = {
        name: "test",
        type: "rotate",
        origin: [0, 0],
      };
      expect(isShapeMutationVector(mutation)).toBe(true);
    });

    it("returns true for stretch mutation", () => {
      const mutation: MutationVector = {
        name: "test",
        type: "stretch",
        origin: [0, 0],
      };
      expect(isShapeMutationVector(mutation)).toBe(true);
    });

    it("returns true for opacity mutation", () => {
      const mutation: MutationVector = {
        name: "test",
        type: "opacity",
        origin: [0, 0],
      };
      expect(isShapeMutationVector(mutation)).toBe(true);
    });

    it("returns false for lightness mutation", () => {
      const mutation: MutationVector = {
        name: "test",
        type: "lightness",
        origin: [0, 0],
      };
      expect(isShapeMutationVector(mutation)).toBe(false);
    });

    it("returns false for colorize mutation", () => {
      const mutation: MutationVector = {
        name: "test",
        type: "colorize",
        origin: [0, 0],
      };
      expect(isShapeMutationVector(mutation)).toBe(false);
    });

    it("returns false for saturation mutation", () => {
      const mutation: MutationVector = {
        name: "test",
        type: "saturation",
        origin: [0, 0],
      };
      expect(isShapeMutationVector(mutation)).toBe(false);
    });
  });

  describe("isColorMutationVector", () => {
    it("returns true for lightness mutation", () => {
      const mutation: MutationVector = {
        name: "test",
        type: "lightness",
        origin: [0, 0],
      };
      expect(isColorMutationVector(mutation)).toBe(true);
    });

    it("returns true for saturation mutation", () => {
      const mutation: MutationVector = {
        name: "test",
        type: "saturation",
        origin: [0, 0],
      };
      expect(isColorMutationVector(mutation)).toBe(true);
    });

    it("returns true for colorize mutation", () => {
      const mutation: MutationVector = {
        name: "test",
        type: "colorize",
        origin: [0, 0],
      };
      expect(isColorMutationVector(mutation)).toBe(true);
    });

    it("returns false for shape mutations", () => {
      const mutation: MutationVector = {
        name: "test",
        type: "deform",
        origin: [0, 0],
        radius: 10,
      };
      expect(isColorMutationVector(mutation)).toBe(false);
    });
  });

  describe("hierarchy node type guards", () => {
    describe("isTreeNode", () => {
      it("returns true for a tree node", () => {
        const node: TreeNode<"layer"> = {
          type: "layer",
          parentId: "root",
        };
        expect(isTreeNode(node)).toBe(true);
      });

      it("returns false for a root node", () => {
        const node: RootNode = {
          type: "root",
          children: [],
        };
        expect(isTreeNode(node)).toBe(false);
      });
    });

    describe("isRootNode", () => {
      it("returns true for a root node", () => {
        const node: RootNode = {
          type: "root",
          children: [],
        };
        expect(isRootNode(node)).toBe(true);
      });

      it("returns false for a tree node", () => {
        const node: TreeNode<"layer"> = {
          type: "layer",
          parentId: "root",
        };
        expect(isRootNode(node)).toBe(false);
      });
    });

    describe("isLayerNode", () => {
      it("returns true for a layer node", () => {
        const node: TreeNode<"layer"> = {
          type: "layer",
          parentId: "root",
        };
        expect(isLayerNode(node)).toBe(true);
      });

      it("returns false for a layer folder node", () => {
        const node: TreeNode<"layerFolder"> = {
          type: "layerFolder",
          parentId: "root",
        };
        expect(isLayerNode(node)).toBe(false);
      });

      it("returns false for a mutation node", () => {
        const node: TreeNode<"mutation"> = {
          type: "mutation",
          parentId: "1",
        };
        expect(isLayerNode(node)).toBe(false);
      });

      it("returns false for a root node", () => {
        const node: RootNode = {
          type: "root",
          children: [],
        };
        expect(isLayerNode(node)).toBe(false);
      });
    });

    describe("isLayerFolderNode", () => {
      it("returns true for a layer folder node", () => {
        const node: TreeNode<"layerFolder"> = {
          type: "layerFolder",
          parentId: "root",
        };
        expect(isLayerFolderNode(node)).toBe(true);
      });

      it("returns false for a layer node", () => {
        const node: TreeNode<"layer"> = {
          type: "layer",
          parentId: "root",
        };
        expect(isLayerFolderNode(node)).toBe(false);
      });
    });

    describe("isMutationNode", () => {
      it("returns true for a mutation node", () => {
        const node: TreeNode<"mutation"> = {
          type: "mutation",
          parentId: "1",
        };
        expect(isMutationNode(node)).toBe(true);
      });

      it("returns false for a layer node", () => {
        const node: TreeNode<"layer"> = {
          type: "layer",
          parentId: "root",
        };
        expect(isMutationNode(node)).toBe(false);
      });
    });
  });

  describe("animation track type guards", () => {
    describe("isControlTrack", () => {
      it("returns true for a control track", () => {
        const track: AnimationTrack = {
          type: "control",
          controlId: "1",
          actions: [],
          length: 1000,
        };
        expect(isControlTrack(track)).toBe(true);
      });

      it("returns false for a visibility track", () => {
        const track: AnimationTrack = {
          type: "visibility",
          layerId: "1",
          actions: [],
          length: 1000,
        };
        expect(isControlTrack(track)).toBe(false);
      });
    });

    describe("isVisibilityTrack", () => {
      it("returns true for a visibility track", () => {
        const track: AnimationTrack = {
          type: "visibility",
          layerId: "1",
          actions: [],
          length: 1000,
        };
        expect(isVisibilityTrack(track)).toBe(true);
      });

      it("returns false for a control track", () => {
        const track: AnimationTrack = {
          type: "control",
          controlId: "1",
          actions: [],
          length: 1000,
        };
        expect(isVisibilityTrack(track)).toBe(false);
      });
    });
  });
});
