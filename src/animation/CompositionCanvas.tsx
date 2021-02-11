import React, { useEffect, useMemo } from "react";
import { ItemSelection, Keyframe, ShapeDefinition } from "../lib/types";
import { showComposition } from "./programs/showComposition";
import { showCompositionMap } from "./programs/showCompositionMap";
import { showCompositionVectors } from "./programs/showCompositionVectors";
import WebGLCanvas from "./WebGLCanvas";

export interface TextureMapCanvasProps {
  image: HTMLImageElement | null;
  shapes: ShapeDefinition[];
  zoom: number;
  panX: number;
  panY: number;
  activeLayer?: ItemSelection | null;
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
  const vectorMap = useMemo(() => showCompositionVectors(), []);
  const renderers = [composition.renderer, layer.renderer, vectorMap.renderer];

  useEffect(() => {
    if (image) {
      composition.setImage(image);
      layer.setImage(image);
      vectorMap.setImage(image);
    }
  }, [image]);

  useEffect(() => {
    composition.setShapes(shapes);
    layer.setShapes(shapes);
    layer.setLayerSelected(activeLayer);
    vectorMap.setLayerSelected(activeLayer);
    vectorMap.setShapes(shapes);
  }, [shapes]);

  useEffect(() => {
    layer.setLayerSelected(activeLayer);
    vectorMap.setLayerSelected(activeLayer);
  }, [activeLayer]);

  composition.setZoom(zoom);
  composition.setPan(panX, panY);
  composition.setKeyframe(keyframe || null);

  layer.setZoom(zoom);
  layer.setPan(panX, panY);
  layer.setKeyframe(keyframe || null);

  vectorMap.setZoom(zoom);
  vectorMap.setPan(panX, panY);
  vectorMap.setKeyframe(keyframe || null);

  return <WebGLCanvas renderers={renderers} />;
};

export default CompositionCanvas;
