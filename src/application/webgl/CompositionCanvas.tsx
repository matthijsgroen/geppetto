import React, { useEffect, useMemo } from "react";
import { GeppettoImage } from "../../animation/file2/types";
import { showComposition } from "./programs/showComposition";
import { showCompositionMap } from "./programs/showCompositionMap";
// import { showCompositionVectors } from "./programs/showCompositionVectors";
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
  // const vectorMap = useMemo(() => showCompositionVectors(), []);
  // const renderers = [composition.renderer, layer.renderer, vectorMap.renderer];
  const renderers = useMemo(
    () => [composition.renderer, layer.renderer],
    [composition.renderer, layer.renderer]
  );

  useEffect(() => {
    if (image) {
      composition.setImage(image);
      layer.setImage(image);
      // vectorMap.setImage(image);
    }
  }, [image, composition, layer]);

  useEffect(() => {
    composition.setShapes(file);
    layer.setShapes(file);
    layer.setLayerSelected(activeLayers);
    // vectorMap.setLayerSelected(activeLayer);
    // vectorMap.setShapes(shapes);
  }, [file, composition, layer, activeLayers]);

  useEffect(() => {
    composition.setVectorValues(vectorValues);
    layer.setVectorValues(vectorValues);
    //   vectorMap.setVectorValues(controlValues);
  }, [vectorValues, composition, layer]);

  useEffect(() => {
    layer.setLayerSelected(activeLayers);
    //   vectorMap.setLayerSelected(activeLayer);
  }, [activeLayers, layer]);

  composition.setZoom(zoom);
  composition.setPan(panX, panY);

  layer.setZoom(zoom);
  layer.setPan(panX, panY);

  // vectorMap.setZoom(zoom);
  // vectorMap.setPan(panX, panY);

  return <WebGLCanvas renderers={renderers} showFPS={showFPS} />;
};

export default CompositionCanvas;
