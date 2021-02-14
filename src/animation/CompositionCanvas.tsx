import React, { useEffect, useMemo } from "react";
import { ItemSelection, ShapeDefinition } from "../lib/types";
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
}

const CompositionCanvas: React.FC<TextureMapCanvasProps> = ({
  image,
  shapes,
  zoom,
  panX,
  panY,
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

  layer.setZoom(zoom);
  layer.setPan(panX, panY);

  vectorMap.setZoom(zoom);
  vectorMap.setPan(panX, panY);

  return <WebGLCanvas renderers={renderers} />;
};

export default CompositionCanvas;
