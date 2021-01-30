import { ImageDefinition } from "../lib/types";

const imageDefinition: ImageDefinition = {
  shapes: [
    {
      name: "character",
      type: "folder",
      items: [
        {
          name: "leftEyeBrow",
          type: "sprite",
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
          mutationVectors: {
            deform1: [10, 0, 20],
          },
          baseElementData: {
            translateX: -25,
            translateY: -235,
          },
        },
        {
          name: "rightEyeBrow",
          type: "sprite",
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
          mutationVectors: {
            deform0: [-10, 0, 20],
          },
          baseElementData: {
            translateX: 7,
            translateY: -235,
          },
        },
        {
          name: "mouthOpen",
          type: "sprite",
          points: [
            [7, 52],
            [35, 52],
            [7, 70],
            [35, 70],
          ],
          baseElementData: {
            translateX: 0,
            translateY: -182,
          },
        },
        {
          name: "leftEye",
          type: "folder",
          items: [
            {
              name: "leftPupil",
              type: "sprite",
              points: [
                [12, 35],
                [23, 45],
                [12, 45],
                [23, 35],
              ],
              baseElementData: {
                translateX: -24,
                translateY: -222,
              },
            },
            {
              name: "eyeSocket",
              type: "sprite",
              points: [
                [9, 21],
                [25, 32],
                [25, 21],
                [9, 32],
              ],
              baseElementData: {
                translateX: -22,
                translateY: -222,
              },
            },
          ],
        },
        {
          name: "rightEye",
          type: "folder",
          items: [
            {
              name: "rightPupil",
              type: "sprite",
              points: [
                [34, 35],
                [47, 45],
                [34, 45],
                [47, 35],
              ],
              baseElementData: {
                translateX: 7,
                translateY: -222,
              },
            },
            {
              name: "rightEyeSocket",
              type: "sprite",
              points: [
                [37, 18],
                [59, 32],
                [37, 32],
                [59, 18],
              ],
              baseElementData: {
                translateX: 7,
                translateY: -222,
              },
            },
          ],
        },
        {
          name: "body",
          type: "sprite",
          points: [
            [422, 3],
            [598, 3],
            [422, 598],
            [598, 600],
          ],
          baseElementData: {},
        },
      ],
    },
  ],
  controls: [
    {
      name: "eyebrows",
      type: "slider",
      min: {
        rightEyeBrow: {
          deformations: {
            deform0: [0, 5],
          },
        },
        leftEyeBrow: {
          deformations: {
            deform1: [0, 5],
          },
        },
      },
      max: {
        rightEyeBrow: {
          deformations: {
            deform0: [0, -10],
          },
        },
        leftEyeBrow: {
          deformations: {
            deform1: [0, -10],
          },
        },
      },
    },
    {
      name: "mouth",
      type: "slider",
      min: {
        mouthOpen: {
          stretchY: 1.0,
        },
      },
      max: {
        mouthOpen: {
          stretchY: 0.2,
        },
      },
    },
    {
      name: "eyes",
      type: "slider",
      min: {
        leftPupil: {
          translateX: -2,
        },
        rightPupil: {
          translateX: -4,
        },
      },
      max: {
        leftPupil: {
          translateX: 3,
        },
        rightPupil: {
          translateX: 4,
        },
      },
    },
  ],
};

export default imageDefinition;
