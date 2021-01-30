import React, { useEffect, useMemo } from "react";
import { ShapeDefinition } from "../lib/types";
import { loadImage } from "../lib/webgl";
import { showLayerPoints } from "./programs/showLayerPoints";
import { showTexture } from "./programs/showTexture";
import { showTextureMap } from "./programs/showTextureMap";
import WebGLCanvas from "./WebGLCanvas";

export interface TextureMapCanvasProps {
  url: string;
  shapes: ShapeDefinition[];
  zoom?: number;
  panX: number;
  panY: number;
  activeLayer?: string | null;
  onMouseMove?(coordinates: [number, number] | null): void;
}

const TextureMapCanvas: React.FC<TextureMapCanvasProps> = ({
  url,
  shapes,
  zoom = 1.0,
  panX,
  panY,
  activeLayer = null,
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
    loadImage(url).then((image) => {
      textureProgram.setImage(image);
      textureMapProgram.setImage(image);
      pointsProgram.setImage(image);
    });
  }, [url]);

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
  pointsProgram.setLayerSelected(activeLayer);

  return <WebGLCanvas renderers={renderers} />;
};

export default TextureMapCanvas;
