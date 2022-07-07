import { ImageDefinition } from "../types";

export const v1Format: ImageDefinition = {
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
            { type: "translate", name: "shove", origin: [20, 20], radius: -1 },
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
    {
      name: "HeadShift",
      type: "slider",
      steps: [{ shove: [0, 0] }, { shove: [-20, 30] }],
    },
  ],
  controlValues: {
    HeadRotate: 0,
    HeadShift: 0.5,
  },

  defaultFrame: {
    rotation: [10, 0],
  },
  animations: [
    {
      name: "breathing",
      looping: true,
      keyframes: [
        {
          time: 500,
          controlValues: {
            HeadRotate: 0.0,
          },
        },
        {
          time: 2500,
          controlValues: {
            HeadRotate: 1.0,
            HeadShift: 1.0,
          },
          event: "Breathing",
        },
        {
          time: 3500,
          controlValues: {},
          event: "Blink",
        },
      ],
    },
  ],
};
