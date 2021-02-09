import React, { useEffect, useMemo } from "react";
import { ItemSelection, ShapeDefinition, Vec2 } from "../lib/types";
import { showLayerPoints } from "./programs/showLayerPoints";
import { showTexture } from "./programs/showTexture";
import { showTextureMap } from "./programs/showTextureMap";
import WebGLCanvas from "./WebGLCanvas";

export interface TextureMapCanvasProps {
  image: HTMLImageElement | null;
  shapes: ShapeDefinition[];
  zoom?: number;
  panX: number;
  panY: number;
  activeCoord?: Vec2 | null;
  activeLayer?: ItemSelection | null;
  onMouseMove?(coordinates: [number, number] | null): void;
}

const TextureMapCanvas: React.FC<TextureMapCanvasProps> = ({
  image,
  shapes,
  zoom = 1.0,
  panX,
  panY,
  activeLayer = null,
  activeCoord = null,
}) => {
  const textureProgram = useMemo(() => showTexture(), []);
  const textureMapProgram = useMemo(() => showTextureMap(), []);
  const pointsProgram = useMemo(() => showLayerPoints(), []);

  const renderers = [
    textureProgram.renderer,
    textureMapProgram.renderer,
    pointsProgram.renderer,
  ];

  useEffect(() => {
    if (image) {
      textureProgram.setImage(image);
      textureMapProgram.setImage(image);
      pointsProgram.setImage(image);
    }
  }, [image]);

  useEffect(() => {
    textureMapProgram.setShapes(shapes);
    pointsProgram.setShapes(shapes);
  }, [shapes]);
  textureMapProgram.setZoom(zoom);
  textureProgram.setZoom(zoom);
  pointsProgram.setZoom(zoom);
  textureMapProgram.setPan(panX, panY);
  textureProgram.setPan(panX, panY);
  pointsProgram.setPan(panX, panY);
  pointsProgram.setLayerSelected(activeLayer ? activeLayer.name : null);
  pointsProgram.setActiveCoord(activeCoord);

  return <WebGLCanvas renderers={renderers} />;
};

export default TextureMapCanvas;
