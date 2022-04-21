import { Vec2 } from "../../../types";

const FOCUS_BORDER = 2;
export const mouseToTextureCoordinate = (
  texture: { width: number; height: number },
  zoom: number,
  panning: Vec2,
  event: React.MouseEvent<HTMLElement>
): Vec2 => {
  const canvasPos = event.currentTarget.getBoundingClientRect();
  const elementX = event.pageX - canvasPos.left;
  const elementY = event.pageY - canvasPos.top - FOCUS_BORDER;
  const result = getTextureCoordinate(
    [canvasPos.width, canvasPos.height - FOCUS_BORDER * 2],
    [texture.width, texture.height],
    panning,
    zoom,
    [elementX, elementY]
  );
  return [result[0], result[1]];
};

export const getInitialScale = (
  canvasSize: Vec2,
  textureSize: Vec2
): number => {
  const [textureWidth, textureHeight] = textureSize;
  const [canvasWidth, canvasHeight] = canvasSize;

  const landscape = textureWidth / canvasWidth > textureHeight / canvasHeight;
  const initialScale = landscape
    ? canvasWidth / textureWidth
    : canvasHeight / textureHeight;
  return initialScale;
};

export const getTextureCoordinate = (
  canvasSize: Vec2,
  textureSize: Vec2,
  panning: Vec2,
  zoom: number,
  coordinate: Vec2
): Vec2 => {
  const [textureWidth, textureHeight] = textureSize;
  const [canvasWidth, canvasHeight] = canvasSize;
  const initialScale = getInitialScale(canvasSize, textureSize);

  // First, calculate the size for 'zoomLevel' 1.0, which is a fit of the texture within the canvas area

  const [panX, panY] = panning;
  const [coordX, coordY] = coordinate;

  const scaledCanvasWidth = canvasWidth / initialScale;
  const scaledCanvasHeight = canvasHeight / initialScale;
  const relativeX = (coordX / canvasWidth) * scaledCanvasWidth;
  const relativeY = (coordY / canvasHeight) * scaledCanvasHeight;
  const halfH = textureHeight / 2;
  const halfW = textureWidth / 2;
  const top =
    scaledCanvasHeight / 2 - halfH - (panY * scaledCanvasHeight * zoom) / 2;
  const left =
    scaledCanvasWidth / 2 - halfW + (panX * scaledCanvasWidth * zoom) / 2;

  const x = (relativeX - left - halfW) / zoom + halfW;
  const y = (relativeY - top - halfH) / zoom + halfH;

  return [Math.round(x), Math.round(y)];
};

export const zoomFactor = (texture: HTMLImageElement | null): number =>
  texture ? (texture.height / window.screen.height) * 2.0 : 1.0;

export const maxZoomFactor = (texture: HTMLImageElement | null): number =>
  zoomFactor(texture) * 4.0;
