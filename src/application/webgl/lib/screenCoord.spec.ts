import { Vec2 } from "../../../types";
import { ScreenTranslation, Size } from "../../types";
import { imageToPixels } from "./screenCoord";

describe("imageToPixels", () => {
  it.each<{
    translation: ScreenTranslation;
    screenPos: Vec2;
    expectedResult: Vec2;
  }>([
    {
      translation: {
        panX: 0,
        panY: 0,
        zoom: 1,
        scale: 1,
      },
      screenPos: [0, 0],
      expectedResult: [250, 150],
    },
    {
      translation: {
        panX: -0.5, // subtracts a quarter of 'width' from the center 250 - 125
        panY: -0.5, // adds a quarter of 'height' to the center 150 + 75
        zoom: 1,
        scale: 1,
      },
      screenPos: [0, 0],
      expectedResult: [125, 225],
    },
    {
      translation: {
        panX: 0,
        panY: 0,
        zoom: 1,
        scale: 1, // one pixel in the image is one on the screen
      },
      screenPos: [50, 0],
      expectedResult: [250 + 50, 150],
    },
    {
      translation: {
        panX: 0,
        panY: 0,
        zoom: 1,
        scale: 0.5, // two pixel in the image is one on the screen
      },
      screenPos: [50, 0],
      expectedResult: [250 + 25, 150],
    },
    {
      translation: {
        panX: 0.5,
        panY: 0,
        zoom: 2,
        scale: 0.5, // two pixel in the image is one on the screen
      },
      screenPos: [50, 0],
      expectedResult: [250 + 50 * 0.5 * 2 + 125 * 2, 150],
    },
  ])(
    "translates file coordinates to pixels on screen",
    ({ screenPos, expectedResult, translation }) => {
      const containerSize: Size = {
        width: 500,
        height: 300,
      };
      const result = imageToPixels(screenPos, translation, containerSize);

      expect(result).toEqual(expectedResult);
    }
  );
});
