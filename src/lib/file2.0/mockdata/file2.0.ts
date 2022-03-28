import { GeppettoImage } from "../types";

export const v2Format: GeppettoImage = {
  version: "2.0",
  metadata: {
    width: 2048,
    height: 1536,
    zoom: 1.0,
    pan: [0, 0],
  },
  layerHierarchy: [{ id: "1", collapsed: false, children: ["2", "5"] }],
  layers: [
    {
      id: "0",
      points: [
        [14, 10],
        [30, 30],
        [14, 30],
      ],
      translate: [1, 30],
    },
    {
      id: "2",
      translate: [10, 3],
      points: [
        [14, 10],
        [50, 50],
        [14, 50],
      ],
    },
    {
      id: "5",
      points: [
        [34, 10],
        [50, 50],
        [34, 50],
      ],
      translate: [10, 3],
    },
    {
      id: "6",
      points: [
        [14, 100],
        [50, 500],
        [14, 500],
      ],
      translate: [0, 0],
    },
  ],
  layersHidden: [],
  names: {
    "0": "item",
    "1": "body",
    "2": "head",
    "3": "rotation",
    "4": "shove",
    "5": "feet",
    "6": "background",
    "7": "HeadRotate",
    "8": "HeadShift",
  },
  mutations: [
    { id: "3", type: "rotate", origin: [20, 20], parentId: "2" },
    {
      id: "4",
      type: "translate",
      origin: [20, 20],
      radius: -1,
      parentId: "2",
    },
  ],
  defaultFrame: {
    "3": [10, 0],
  },
  controls: [
    {
      id: "7",
      type: "slider",
      steps: [{ "3": [0, 0] }, { "3": [40, 0] }],
    },
    {
      id: "8",
      type: "slider",
      steps: [{ "4": [0, 0] }, { "4": [-20, 30] }],
    },
  ],
  controlValues: {
    "7": 0,
    "8": 0.5,
  },
  animations: [],
  animationHierarchy: [],
};
