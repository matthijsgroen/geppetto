import React, { useEffect, useMemo } from "react";
import { Keyframe, ShapeDefinition } from "../lib/types";
import { showComposition } from "./programs/showComposition";
import { showCompositionMap } from "./programs/showCompositionMap";
import WebGLCanvas from "./WebGLCanvas";

export interface TextureMapCanvasProps {
  image: HTMLImageElement | null;
  shapes: ShapeDefinition[];
  zoom: number;
  panX: number;
  panY: number;
  activeLayer?: string | null;
  keyframe?: Keyframe;
}

const CompositionCanvas: React.FC<TextureMapCanvasProps> = ({
  image,
  shapes,
  zoom,
  panX,
  panY,
  keyframe,
  activeLayer = null,
}) => {
  const composition = useMemo(() => showComposition(), []);
  const layer = useMemo(() => showCompositionMap(), []);
  const renderers = [composition.renderer, layer.renderer];

  useEffect(() => {
    if (image) {
      composition.setImage(image);
      layer.setImage(image);
    }
  }, [image]);

  useEffect(() => {
    composition.setShapes(shapes);
    layer.setShapes(shapes);
  }, [shapes]);
  composition.setZoom(zoom);
  composition.setPan(panX, panY);
  composition.setKeyframe(keyframe || null);
  layer.setZoom(zoom);
  layer.setPan(panX, panY);
  layer.setLayerSelected(activeLayer);
  layer.setKeyframe(keyframe || null);

  return <WebGLCanvas renderers={renderers} />;
};

export default CompositionCanvas;
