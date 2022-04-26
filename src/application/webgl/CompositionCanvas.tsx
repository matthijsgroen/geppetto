import React, { useEffect, useMemo } from "react";
import { GeppettoImage } from "../../animation/file2/types";
import { showComposition } from "./programs/showComposition";
import { showCompositionMap } from "./programs/showCompositionMap";
import { showCompositionVectors } from "./programs/showCompositionVectors";
import WebGLCanvas from "./WebGLCanvas";

export interface CompositionCanvasProps {
  image: HTMLImageElement | null;
  file: GeppettoImage;
  vectorValues: GeppettoImage["defaultFrame"];
  activeLayers: string[];
  zoom: number;
  panX: number;
  panY: number;
  showFPS?: boolean;
}

const CompositionCanvas: React.FC<CompositionCanvasProps> = ({
  image,
  file,
  vectorValues,
  activeLayers,
  zoom,
  panX,
  panY,
  showFPS,
}) => {
  const composition = useMemo(() => showComposition(), []);
  const layer = useMemo(() => showCompositionMap(), []);
  const vectorMap = useMemo(() => showCompositionVectors(), []);
  const renderers = useMemo(
    () => [composition.renderer, layer.renderer, vectorMap.renderer],
    [composition.renderer, layer.renderer, vectorMap.renderer]
  );

  useEffect(() => {
    if (image) {
      composition.setImage(image);
      layer.setImage(image);
      vectorMap.setImage(image);
    }
  }, [image, composition, layer, vectorMap]);

  useEffect(() => {
    composition.setShapes(file);
    layer.setShapes(file);
    layer.setLayerSelected(activeLayers);
    vectorMap.setLayerSelected(activeLayers);
    vectorMap.setShapes(file);
  }, [file, composition, layer, vectorMap, activeLayers]);

  useEffect(() => {
    composition.setVectorValues(vectorValues);
    layer.setVectorValues(vectorValues);
    vectorMap.setVectorValues(vectorValues);
  }, [vectorValues, composition, layer, vectorMap]);

  useEffect(() => {
    layer.setLayerSelected(activeLayers);
    vectorMap.setLayerSelected(activeLayers);
  }, [activeLayers, layer, vectorMap]);

  composition.setZoom(zoom);
  composition.setPan(panX, panY);

  layer.setZoom(zoom);
  layer.setPan(panX, panY);

  vectorMap.setZoom(zoom);
  vectorMap.setPan(panX, panY);

  return <WebGLCanvas renderers={renderers} showFPS={showFPS} />;
};

export default CompositionCanvas;
