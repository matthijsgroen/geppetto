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
          offset: [-25, -235],
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
        [57, 15],
        [50, 5],
        [57, 5],
        [64, 15],
        [66, 5],
      ],
      settings: {
        parent: {
          id: "body",
          offset: [7, -235],
        },
        anchor: [50, 11],
      },
      mutationVectors: {
        deform0: [50, 11, 40],
      },
    },
    {
      name: "mouthOpen",
      points: [
        [7, 52],
        [35, 52],
        [7, 70],
        [35, 70],
      ],
      settings: {
        parent: {
          id: "body",
          offset: [15, -185],
        },
        anchor: [38, 60],
      },
    },
    {
      name: "leftPupil",
      points: [
        [12, 35],
        [23, 45],
        [12, 45],
        [23, 35],
      ],
      settings: {
        parent: {
          id: "leftEye",
          offset: [-2, 0],
        },
        anchor: [17, 40],
      },
    },
    {
      name: "leftEye",
      points: [
        [9, 21],
        [25, 32],
        [25, 21],
        [9, 32],
      ],
      settings: {
        parent: {
          id: "body",
          offset: [-22, -222],
        },
        anchor: [17, 27],
      },
    },
    {
      name: "rightPupil",
      points: [
        [34, 35],
        [47, 45],
        [34, 45],
        [47, 35],
      ],
      settings: {
        parent: {
          id: "rightEye",
          offset: [0, 0],
        },
        anchor: [41, 40],
      },
    },
    {
      name: "rightEye",
      points: [
        [37, 18],
        [59, 32],
        [37, 32],
        [59, 18],
      ],
      settings: {
        parent: {
          id: "body",
          offset: [7, -222],
        },
        anchor: [48, 25],
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
  controls: [
    {
      name: "eyebrows",
      type: "slider",
      min: {
        rightEyeBrow: {
          deformations: {
            deform0: [0, 0],
          },
        },
      },
      max: {
        rightEyeBrow: {
          deformations: {
            deform0: [-0.5, -40],
          },
        },
      },
    },
  ],
};

export default imageDefinition;
