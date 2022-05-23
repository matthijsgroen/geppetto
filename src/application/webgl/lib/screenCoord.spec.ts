import { Vec2 } from "../../../types";
import { ScreenTranslation, Size } from "../../types";
import { imageToPixels, pixelsToImage } from "./screenCoord";

const containerSize: Size = {
  width: 500,
  height: 300,
};

const testCases: {
  translation: ScreenTranslation;
  screenPos: Vec2;
  pixelPos: Vec2;
}[] = [
  {
    translation: {
      panX: 0,
      panY: 0,
      zoom: 1,
      scale: 1,
    },
    screenPos: [0, 0],
    pixelPos: [250, 150],
  },
  {
    translation: {
      panX: -0.5, // subtracts a quarter of 'width' from the center 250 - 125
      panY: -0.5, // adds a quarter of 'height' to the center 150 + 75
      zoom: 1,
      scale: 1,
    },
    screenPos: [0, 0],
    pixelPos: [125, 225],
  },
  {
    translation: {
      panX: 0,
      panY: 0,
      zoom: 1,
      scale: 1, // one pixel in the image is one on the screen
    },
    screenPos: [50, 0],
    pixelPos: [250 + 50, 150],
  },
  {
    translation: {
      panX: 0,
      panY: 0,
      zoom: 1,
      scale: 0.5, // two pixel in the image is one on the screen
    },
    screenPos: [50, 0],
    pixelPos: [250 + 25, 150],
  },
  {
    translation: {
      panX: 0.5,
      panY: 0,
      zoom: 2,
      scale: 0.5, // two pixel in the image is one on the screen
    },
    screenPos: [50, 0],
    pixelPos: [250 + 50 * 0.5 * 2 + 125 * 2, 150],
  },
];

describe("imageToPixels", () => {
  it.each(testCases)(
    "translates file coordinates to pixels on screen",
    ({ screenPos, pixelPos, translation }) => {
      const converter = imageToPixels(translation, containerSize);
      const result = converter(screenPos);

      expect(result).toEqual(pixelPos);
    }
  );
});

describe("pixelsToImage", () => {
  it.each(testCases)(
    "translates pixels on screen to file coordinates",
    ({ screenPos, pixelPos, translation }) => {
      const converter = pixelsToImage(translation, containerSize);
      const result = converter(pixelPos);

      expect(result).toEqual(screenPos);
    }
  );
});
