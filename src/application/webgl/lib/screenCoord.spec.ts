import { Vec2 } from "../../../types";
import { ScreenTranslation, Size } from "../../types";
import { imageToPixels } from "./screenCoord";

describe("imageToPixels", () => {
  it("translates file coordinates to pixels on screen", () => {
    const center: Vec2 = [0, 0];
    const translation: ScreenTranslation = {
      panX: 0,
      panY: 0,
      zoom: 1,
      scale: 1,
    };
    const containerSize: Size = {
      width: 500,
      height: 300,
    };
    const result = imageToPixels(center, translation, containerSize);

    expect(result).toEqual([250, 150]);
  });
});
