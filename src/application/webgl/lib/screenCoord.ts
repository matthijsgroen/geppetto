import { Vec2 } from "../../../types";
import { ScreenTranslation, Size } from "../../types";
import { vecAdd, vecScale } from "./vertices";

export const imageToPixels = (
  coord: Vec2,
  translation: ScreenTranslation,
  rect: Size
): Vec2 => {
  const center: Vec2 = [0.5 * rect.width, 0.5 * rect.height];
  const panning: Vec2 = [
    translation.panX * rect.width,
    -translation.panY * rect.height,
  ];
  const vecZoom = vecScale(panning, translation.zoom / 2);

  return vecAdd(
    vecAdd(vecScale(coord, translation.zoom * translation.scale), center),
    vecZoom
  );
};
