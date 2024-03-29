import { GeppettoImage } from "../types";

export const v2Format: GeppettoImage = {
  version: "2.0",
  metadata: {
    width: 2048,
    height: 1536,
    zoom: 1.0,
    pan: [0, 0],
  },
  layerHierarchy: {
    root: { type: "root", children: ["0", "1", "7"] },
    "0": { type: "layer", parentId: "root" },
    "1": { type: "layerFolder", parentId: "root", children: ["2", "5", "6"] },
    "2": { type: "layer", parentId: "1", children: ["3", "4"] },
    "3": { type: "mutation", parentId: "2" },
    "4": { type: "mutation", parentId: "2" },
    "5": { type: "layer", parentId: "1" },
    "6": { type: "layerFolder", parentId: "1", children: [] },
    "7": { type: "layer", parentId: "root" },
  },
  layerFolders: {
    "1": {
      name: "body",
      visible: true,
      collapsed: false,
    },
    "6": {
      name: "arm",
      visible: true,
      collapsed: false,
    },
  },
  layers: {
    "0": {
      name: "item",
      visible: true,
      points: [
        [14, 10],
        [30, 30],
        [14, 30],
      ],
      translate: [1, 30],
    },
    "2": {
      name: "head",
      visible: true,
      points: [
        [14, 10],
        [50, 50],
        [14, 50],
      ],
      translate: [10, 3],
    },
    "5": {
      name: "feet",
      visible: true,
      points: [
        [34, 10],
        [50, 50],
        [34, 50],
      ],
      translate: [10, 3],
    },
    "7": {
      name: "background",
      visible: true,
      points: [
        [14, 100],
        [50, 500],
        [14, 500],
      ],
      translate: [0, 0],
    },
  },
  mutations: {
    "3": {
      name: "rotation",
      type: "rotate",
      origin: [20, 20],
    },
    "4": {
      name: "shove",
      type: "translate",
      origin: [20, 20],
      radius: -1,
    },
  },
  controlHierarchy: {
    root: { type: "root", children: ["0", "1"] },
    "0": { type: "control", parentId: "root" },
    "1": { type: "control", parentId: "root" },
  },
  controls: {
    "0": {
      name: "HeadRotate",
      type: "slider",
      steps: [{ "3": [0, 0] }, { "3": [40, 0] }],
    },
    "1": {
      name: "HeadShift",
      type: "slider",
      steps: [{ "4": [0, 0] }, { "4": [-20, 30] }],
    },
  },
  controlFolders: {},
  defaultFrame: {
    "3": [10, 0],
  },
  controlValues: {
    "0": 0,
    "1": 0.5,
  },

  animationHierarchy: {
    root: { type: "root", children: ["0"] },
    "0": { type: "animation", parentId: "root" },
  },
  animationFolders: {},
  animations: {
    "0": {
      name: "breathing",
      looping: true,
      actions: [
        {
          start: 0,
          duration: 500,
          easingFunction: "linear",
          controlId: "0",
          controlValue: 0,
        },
        {
          start: 0,
          duration: 2500,
          easingFunction: "linear",
          controlId: "1",
          controlValue: 1,
        },
        {
          start: 500,
          duration: 2000,
          easingFunction: "linear",
          controlId: "0",
          controlValue: 1,
        },
        { start: 2500, event: "Breathing" },
        { start: 3500, event: "Blink" },
      ],
    },
  },
};
