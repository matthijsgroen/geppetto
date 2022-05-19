import { Vec2 } from "../../../types";
import { ScreenTranslation, Size } from "../../types";
import { vecAdd, vecScale, vecSub } from "./vertices";

export const imageToPixels = (translation: ScreenTranslation, rect: Size) => {
  const center: Vec2 = [0.5 * rect.width, 0.5 * rect.height];
  const panning: Vec2 = [
    translation.panX * rect.width,
    -translation.panY * rect.height,
  ];
  const vecZoom = vecScale(panning, translation.zoom / 2);

  const translate = vecAdd(center, vecZoom);
  const scale = translation.zoom * translation.scale;

  return (coord: Vec2): Vec2 => vecAdd(vecScale(coord, scale), translate);
};

export const pixelsToImage = (translation: ScreenTranslation, rect: Size) => {
  const center: Vec2 = [0.5 * rect.width, 0.5 * rect.height];
  const panning: Vec2 = [
    translation.panX * rect.width,
    -translation.panY * rect.height,
  ];
  const vecZoom = vecScale(panning, translation.zoom / 2);

  const translate = vecAdd(center, vecZoom);
  const scale = translation.zoom * translation.scale;

  return (coord: Vec2) => vecScale(vecSub(coord, translate), 1 / scale);
};
