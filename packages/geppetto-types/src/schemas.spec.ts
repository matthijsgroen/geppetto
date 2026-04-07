import { describe, it, expect } from "vitest";
import {
  geppettoImageSchema,
  mutationVectorSchema,
  vec2Schema,
  layerSchema,
  animationSchema,
} from "./schemas";

describe("schemas", () => {
  describe("vec2Schema", () => {
    it("validates a valid Vec2", () => {
      const result = vec2Schema.safeParse([1, 2]);
      expect(result.success).toBe(true);
    });

    it("rejects array with wrong length", () => {
      const result = vec2Schema.safeParse([1, 2, 3]);
      expect(result.success).toBe(false);
    });

    it("rejects array with non-numbers", () => {
      const result = vec2Schema.safeParse([1, "2"]);
      expect(result.success).toBe(false);
    });
  });

  describe("mutationVectorSchema", () => {
    it("validates a deform mutation", () => {
      const mutation = {
        name: "test",
        type: "deform",
        origin: [0, 0],
        radius: 10,
      };
      const result = mutationVectorSchema.safeParse(mutation);
      expect(result.success).toBe(true);
    });

    it("validates a translate mutation", () => {
      const mutation = {
        name: "test",
        type: "translate",
        origin: [0, 0],
        radius: 10,
      };
      const result = mutationVectorSchema.safeParse(mutation);
      expect(result.success).toBe(true);
    });

    it("validates a rotate mutation", () => {
      const mutation = {
        name: "test",
        type: "rotate",
        origin: [0, 0],
      };
      const result = mutationVectorSchema.safeParse(mutation);
      expect(result.success).toBe(true);
    });

    it("validates a stretch mutation", () => {
      const mutation = {
        name: "test",
        type: "stretch",
        origin: [0, 0],
      };
      const result = mutationVectorSchema.safeParse(mutation);
      expect(result.success).toBe(true);
    });

    it("validates an opacity mutation", () => {
      const mutation = {
        name: "test",
        type: "opacity",
        origin: [0, 0],
      };
      const result = mutationVectorSchema.safeParse(mutation);
      expect(result.success).toBe(true);
    });

    it("validates a lightness mutation", () => {
      const mutation = {
        name: "test",
        type: "lightness",
        origin: [0, 0],
      };
      const result = mutationVectorSchema.safeParse(mutation);
      expect(result.success).toBe(true);
    });

    it("validates a saturation mutation", () => {
      const mutation = {
        name: "test",
        type: "saturation",
        origin: [0, 0],
      };
      const result = mutationVectorSchema.safeParse(mutation);
      expect(result.success).toBe(true);
    });

    it("validates a colorize mutation", () => {
      const mutation = {
        name: "test",
        type: "colorize",
        origin: [0, 0],
      };
      const result = mutationVectorSchema.safeParse(mutation);
      expect(result.success).toBe(true);
    });

    it("rejects invalid mutation type", () => {
      const mutation = {
        name: "test",
        type: "invalid",
        origin: [0, 0],
      };
      const result = mutationVectorSchema.safeParse(mutation);
      expect(result.success).toBe(false);
    });

    it("rejects mutation without required radius for deform", () => {
      const mutation = {
        name: "test",
        type: "deform",
        origin: [0, 0],
      };
      const result = mutationVectorSchema.safeParse(mutation);
      expect(result.success).toBe(false);
    });

    it("rejects mutation with invalid origin", () => {
      const mutation = {
        name: "test",
        type: "rotate",
        origin: [0, 0, 0],
      };
      const result = mutationVectorSchema.safeParse(mutation);
      expect(result.success).toBe(false);
    });
  });

  describe("layerSchema", () => {
    it("validates a valid layer", () => {
      const layer = {
        name: "test",
        visible: true,
        points: [
          [0, 0],
          [10, 10],
        ],
        translate: [0, 0],
      };
      const result = layerSchema.safeParse(layer);
      expect(result.success).toBe(true);
    });

    it("rejects layer with invalid points", () => {
      const layer = {
        name: "test",
        visible: true,
        points: [[0, 0, 0]],
        translate: [0, 0],
      };
      const result = layerSchema.safeParse(layer);
      expect(result.success).toBe(false);
    });

    it("rejects layer without visible field", () => {
      const layer = {
        name: "test",
        points: [[0, 0]],
        translate: [0, 0],
      };
      const result = layerSchema.safeParse(layer);
      expect(result.success).toBe(false);
    });
  });

  describe("animationSchema", () => {
    it("validates a valid animation with control track", () => {
      const animation = {
        name: "test",
        looping: true,
        tracks: [
          {
            type: "control",
            controlId: "1",
            actions: [
              {
                start: 0,
                easingFunction: "linear",
                controlEndValue: 1,
                duration: 1000,
              },
            ],
            length: 1000,
          },
        ],
        events: [],
      };
      const result = animationSchema.safeParse(animation);
      expect(result.success).toBe(true);
    });

    it("validates a valid animation with visibility track", () => {
      const animation = {
        name: "test",
        looping: false,
        tracks: [
          {
            type: "visibility",
            layerId: "1",
            actions: [
              {
                start: 0,
                visible: true,
              },
            ],
            length: 1000,
          },
        ],
        events: [],
      };
      const result = animationSchema.safeParse(animation);
      expect(result.success).toBe(true);
    });

    it("validates animation with events", () => {
      const animation = {
        name: "test",
        looping: true,
        tracks: [],
        events: [
          {
            id: "event-1",
            start: 500,
            eventName: "customEvent",
            type: "callback",
          },
        ],
      };
      const result = animationSchema.safeParse(animation);
      expect(result.success).toBe(true);
    });

    it("rejects animation with invalid easing function", () => {
      const animation = {
        name: "test",
        looping: true,
        tracks: [
          {
            type: "control",
            controlId: "1",
            actions: [
              {
                start: 0,
                easingFunction: "invalid",
                controlEndValue: 1,
                duration: 1000,
              },
            ],
            length: 1000,
          },
        ],
        events: [],
      };
      const result = animationSchema.safeParse(animation);
      expect(result.success).toBe(false);
    });
  });

  describe("geppettoImageSchema", () => {
    const validImage = {
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

    it("validates a valid GeppettoImage", () => {
      const result = geppettoImageSchema.safeParse(validImage);
      expect(result.success).toBe(true);
    });

    it("validates version 2.1", () => {
      const image = { ...validImage, version: "2.1" };
      const result = geppettoImageSchema.safeParse(image);
      expect(result.success).toBe(true);
    });

    it("rejects version 1.x", () => {
      const image = { ...validImage, version: "1.0" };
      const result = geppettoImageSchema.safeParse(image);
      expect(result.success).toBe(false);
    });

    it("rejects version 3.x", () => {
      const image = { ...validImage, version: "3.0" };
      const result = geppettoImageSchema.safeParse(image);
      expect(result.success).toBe(false);
    });

    it("rejects invalid metadata", () => {
      const image = {
        ...validImage,
        metadata: { ...validImage.metadata, width: "invalid" },
      };
      const result = geppettoImageSchema.safeParse(image);
      expect(result.success).toBe(false);
    });

    it("rejects missing required fields", () => {
      const { metadata: _metadata, ...incomplete } = validImage;
      const result = geppettoImageSchema.safeParse(incomplete);
      expect(result.success).toBe(false);
    });

    it("validates complex structure with layers and mutations", () => {
      const image = {
        ...validImage,
        layerHierarchy: {
          root: { type: "root", children: ["1"] },
          "1": { type: "layer", parentId: "root", children: ["2"] },
          "2": { type: "mutation", parentId: "1" },
        },
        layers: {
          "1": {
            name: "Layer 1",
            visible: true,
            points: [
              [0, 0],
              [10, 10],
            ],
            translate: [0, 0],
          },
        },
        mutations: {
          "2": {
            name: "Deform",
            type: "deform",
            origin: [5, 5],
            radius: 10,
          },
        },
      };
      const result = geppettoImageSchema.safeParse(image);
      expect(result.success).toBe(true);
    });
  });
});
