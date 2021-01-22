import { ImageDefinition } from "../lib/types";

const imageDefinition: ImageDefinition = {
  shapes: [
    {
      name: "leftEyeBrow",
      points: [
        [6, 17],
        [6, 7],
        [13, 17],
        [13, 7],
        [20, 17],
        [20, 7],
        [27, 17],
        [27, 7],
      ],
      settings: {
        parent: {
          id: "body",
          offset: [-25, -235, 3],
        },
        anchor: [16, 12],
      },
    },
    {
      name: "rightEyeBrow",
      points: [
        [34, 7],
        [36, 17],
        [43, 17],
        [43, 5],
        [50, 15],
        [50, 5],
        [57, 15],
        [57, 5],
        [64, 15],
        [66, 5],
      ],
      settings: {
        parent: {
          id: "body",
          offset: [10, -235, 3],
        },
        anchor: [50, 11],
      },
    },
    {
      name: "body",
      points: [
        [422, 3],
        [598, 3],
        [422, 598],
        [598, 600],
      ],
      settings: {
        anchor: [511, 302],
      },
    },
  ],
};

export default imageDefinition;
