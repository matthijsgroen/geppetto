import React, { useEffect, useMemo } from "react";
import { ShapesDefinition } from "../lib/types";
import { loadImage } from "../lib/webgl";
import { showTexture } from "./programs/showTexture";
import { showTextureMap } from "./programs/showTextureMap";
import WebGLCanvas from "./WebGLCanvas";

export interface TextureMapCanvasProps {
  url: string;
  shapes: ShapesDefinition[];
  zoom: number;
  panX: number;
  panY: number;
  onMouseMove?(coordinates: [number, number] | null): void;
}

const TextureMapCanvas: React.FC<TextureMapCanvasProps> = ({
  url,
  shapes,
  zoom,
  panX,
  panY,
}) => {
  const textureProgram = useMemo(() => showTexture(), []);
  const textureMapProgram = useMemo(() => showTextureMap(), []);

  const renderers = [textureProgram.renderer, textureMapProgram.renderer];

  useEffect(() => {
    loadImage(url).then((image) => {
      textureProgram.setImage(image);
      textureMapProgram.setImage(image);
    });
  }, [url]);

  useEffect(() => {
    textureMapProgram.setShapes(shapes);
  }, [shapes]);
  textureMapProgram.setZoom(zoom);
  textureProgram.setZoom(zoom);
  textureMapProgram.setPan(panX, panY);
  textureProgram.setPan(panX, panY);

  return <WebGLCanvas renderers={renderers} />;
};

export default TextureMapCanvas;
