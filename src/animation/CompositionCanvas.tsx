import React, { useEffect, useState } from "react";
import { ShapesDefinition } from "../lib/types";
import { loadImage, WebGLRenderer } from "../lib/webgl";
import { showComposition } from "./programs/showComposition";
import WebGLCanvas from "./WebGLCanvas";

export interface TextureMapCanvasProps {
  url: string;
  shapes: ShapesDefinition[];
}

const CompositionCanvas: React.FC<TextureMapCanvasProps> = ({
  url,
  shapes,
}) => {
  const [renderers, setRenderers] = useState([] as WebGLRenderer[]);
  useEffect(() => {
    loadImage(url).then((image) => {
      setRenderers([showComposition(image, shapes)]);
    });
  }, []);

  return <WebGLCanvas renderers={renderers} />;
};

export default CompositionCanvas;
