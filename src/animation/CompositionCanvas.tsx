import React, { useEffect, useMemo } from "react";
import { ShapesDefinition } from "../lib/types";
import { loadImage } from "../lib/webgl";
import { showComposition } from "./programs/showComposition";
import { showCompositionMap } from "./programs/showCompositionMap";
import WebGLCanvas from "./WebGLCanvas";

export interface TextureMapCanvasProps {
  url: string;
  shapes: ShapesDefinition[];
  zoom: number;
  panX: number;
  panY: number;
  activeLayer?: string | null;
}

const CompositionCanvas: React.FC<TextureMapCanvasProps> = ({
  url,
  shapes,
  zoom,
  panX,
  panY,
  activeLayer = null,
}) => {
  const composition = useMemo(() => showComposition(), []);
  const layer = useMemo(() => showCompositionMap(), []);
  const renderers = [composition.renderer, layer.renderer];

  useEffect(() => {
    loadImage(url).then((image) => {
      composition.setImage(image);
      layer.setImage(image);
    });
  }, [url]);

  useEffect(() => {
    composition.setShapes(shapes);
    layer.setShapes(shapes);
  }, [shapes]);
  composition.setZoom(zoom);
  composition.setPan(panX, panY);
  layer.setZoom(zoom);
  layer.setPan(panX, panY);
  layer.setLayerSelected(activeLayer);

  return <WebGLCanvas renderers={renderers} />;
};

export default CompositionCanvas;
