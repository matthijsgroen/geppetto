import React, { useEffect, useMemo } from "react";
import { ShapesDefinition } from "../lib/types";
import { loadImage } from "../lib/webgl";
import { showComposition } from "./programs/showComposition";
import WebGLCanvas from "./WebGLCanvas";

export interface TextureMapCanvasProps {
  url: string;
  shapes: ShapesDefinition[];
  zoom: number;
  panX: number;
  panY: number;
}

const CompositionCanvas: React.FC<TextureMapCanvasProps> = ({
  url,
  shapes,
  zoom,
  panX,
  panY,
}) => {
  const composition = useMemo(() => showComposition(), []);
  const renderers = [composition.renderer];

  useEffect(() => {
    loadImage(url).then((image) => {
      composition.setImage(image);
    });
  }, [url]);

  useEffect(() => {
    composition.setShapes(shapes);
  }, [shapes]);
  composition.setZoom(zoom);
  composition.setPan(panX, panY);

  return <WebGLCanvas renderers={renderers} />;
};

export default CompositionCanvas;
