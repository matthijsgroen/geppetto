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
}

const TextureMapCanvas: React.FC<TextureMapCanvasProps> = ({
  url,
  shapes,
  zoom,
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

  return <WebGLCanvas renderers={renderers} />;
};

export default TextureMapCanvas;
