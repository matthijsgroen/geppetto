import React, { useEffect, useState } from "react";
import { ShapesDefinition } from "../lib/types";
import { loadImage, WebGLRenderer } from "../lib/webgl";
import { showTexture } from "./programs/showTexture";
import { showTextureMap } from "./programs/showTextureMap";
import WebGLCanvas from "./WebGLCanvas";

export interface TextureMapCanvasProps {
  url: string;
  shapes: ShapesDefinition[];
}

const TextureMapCanvas: React.FC<TextureMapCanvasProps> = ({ url, shapes }) => {
  const [renderers, setRenderers] = useState([] as WebGLRenderer[]);
  useEffect(() => {
    loadImage(url).then((image) => {
      setRenderers([showTexture(image), showTextureMap(image, shapes)]);
    });
  }, []);

  return <WebGLCanvas renderers={renderers} />;
};

export default TextureMapCanvas;
