import { convertv1tov2, convertv2tov1 } from "./convert";
import { ImageDefinition } from "../types";
import { GeppettoImage } from "./types";

describe("from1to2", () => {
  const v1Format: ImageDefinition = {
    version: "1.1",
    shapes: [
      {
        name: "item",
        type: "sprite",
        mutationVectors: [],
        points: [
          [14, 10],
          [30, 30],
          [14, 30],
        ],
        translate: [1, 30],
      },
      {
        name: "body",
        type: "folder",
        mutationVectors: [],
        items: [
          {
            name: "head",
            type: "sprite",
            mutationVectors: [
              { type: "rotate", name: "rotation", origin: [20, 20] },
            ],
            points: [
              [14, 10],
              [50, 50],
              [14, 50],
            ],
            translate: [10, 3],
          },
          {
            name: "feet",
            type: "sprite",
            mutationVectors: [],
            points: [
              [34, 10],
              [50, 50],
              [34, 50],
            ],
            translate: [10, 3],
          },
        ],
      },
      {
        name: "background",
        type: "sprite",
        mutationVectors: [],
        points: [
          [14, 100],
          [50, 500],
          [14, 500],
        ],
        translate: [0, 0],
      },
    ],
    controls: [
      {
        name: "HeadRotate",
        type: "slider",
        steps: [{ rotation: [0, 0] }, { rotation: [40, 0] }],
      },
    ],
    controlValues: {
      HeadRotate: 0,
    },

    defaultFrame: {
      rotation: [10, 0],
    },
    animations: [],
  };

  const v2Format: GeppettoImage = {
    version: "2.0",
    layerHierarchy: [{ id: "1", collapsed: false, children: ["2", "4"] }],
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
        id: "4",
        points: [
          [34, 10],
          [50, 50],
          [34, 50],
        ],
        translate: [10, 3],
      },
      {
        id: "5",
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
      "4": "feet",
      "5": "background",
      "6": "HeadRotate",
    },
    mutations: [{ type: "rotate", id: "3", origin: [20, 20], parent: "2" }],
    defaultFrame: {
      "3": [10, 0],
    },
    controls: [
      {
        id: "6",
        type: "slider",
        steps: [{ "3": [0, 0] }, { "3": [40, 0] }],
      },
    ],
    controlValues: {
      "6": 0,
    },
    animations: [],
    animationHierarchy: [],
  };

  it("converts a 1.x file format to a 2.x file format", () => {
    const v2 = convertv1tov2(v1Format);
    expect(v2).toEqual(v2Format);
  });

  it("converts a 2.x file format to a 1.x file format", () => {
    const v1 = convertv2tov1(v2Format);
    expect(v1).toEqual(v1Format);
  });

  it("has a compacter format for the same features", () => {
    const v1Length = JSON.stringify(v1Format).length;
    const v2Length = JSON.stringify(v2Format).length;
    expect(v2Length).toBeLessThan(v1Length);
  });
});
