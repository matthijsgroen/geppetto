import { bench, describe } from "vitest";
import { prepareAnimation } from "./prepareAnimation";
import type { GeppettoImage } from "@geppetto/types";

// Load demo file for realistic benchmarking
import sceneryData from "../demo/scenery.json";

const sceneryImage = sceneryData as GeppettoImage;

describe("prepareAnimation performance", () => {
  bench("prepare complex scene (scenery.json)", () => {
    prepareAnimation(sceneryImage, { validate: false });
  });

  bench("prepare complex scene with validation", () => {
    prepareAnimation(sceneryImage, { validate: true });
  });

  // Benchmark with smaller synthetic data
  const smallImage: GeppettoImage = {
    version: "2.0",
    metadata: {
      width: 100,
      height: 100,
      zoom: 1,
      pan: [0, 0],
    },
    layerHierarchy: {
      root: {
        type: "layerFolder",
        children: ["layer1"],
      },
      layer1: {
        type: "layer",
        parentId: "root",
        children: ["mut1"],
      },
      mut1: {
        type: "mutation",
        parentId: "layer1",
      },
    },
    layers: {
      layer1: {
        name: "Layer1",
        points: [
          [0, 0],
          [10, 10],
          [5, 5],
        ],
        translate: [0, 0],
      },
    },
    mutations: {
      mut1: { type: "translate", origin: [5, 5], radius: -1 },
    },
    layerFolders: {},
    controlHierarchy: {
      root: {
        type: "controlFolder",
        children: ["ctrl1"],
      },
      ctrl1: {
        type: "control",
        parentId: "root",
      },
    },
    controlFolders: {},
    controls: {
      ctrl1: {
        name: "Control1",
        type: "slider",
        steps: [{ mut1: [0, 0] }, { mut1: [10, 0] }],
      },
    },
    animations: {},
  };

  bench("prepare small scene (1 layer, 1 mutation)", () => {
    prepareAnimation(smallImage, { validate: false });
  });
});
