import React, { useEffect, useMemo } from "react";
import { GeppettoImage } from "../../animation/file2/types";
import { showComposition } from "./programs/showComposition";
// import { showCompositionMap } from "./programs/showCompositionMap";
// import { showCompositionVectors } from "./programs/showCompositionVectors";
import WebGLCanvas from "./WebGLCanvas";

export interface CompositionCanvasProps {
  image: HTMLImageElement | null;
  file: GeppettoImage;
  vectorValues: GeppettoImage["controlValues"];
  zoom: number;
  panX: number;
  panY: number;
  showFPS?: boolean;
}

const CompositionCanvas: React.FC<CompositionCanvasProps> = ({
  image,
  file,
  vectorValues,
  zoom,
  panX,
  panY,
  showFPS,
}) => {
  const composition = useMemo(() => showComposition(), []);
  // const layer = useMemo(() => showCompositionMap(), []);
  // const vectorMap = useMemo(() => showCompositionVectors(), []);
  // const renderers = [composition.renderer, layer.renderer, vectorMap.renderer];
  const renderers = useMemo(
    () => [composition.renderer],
    [composition.renderer]
  );

  useEffect(() => {
    if (image) {
      composition.setImage(image);
      // layer.setImage(image);
      // vectorMap.setImage(image);
    }
  }, [image, composition]);

  useEffect(() => {
    composition.setShapes(file);
    // layer.setShapes(shapes);
    // layer.setLayerSelected(activeLayer);
    // vectorMap.setLayerSelected(activeLayer);
    // vectorMap.setShapes(shapes);
  }, [file, composition]);

  // useEffect(() => {
  //   composition.setVectorValues(vectorValues);
  //   layer.setVectorValues(vectorValues);
  //   vectorMap.setVectorValues(vectorValues);
  // }, [vectorValues]);

  // useEffect(() => {
  //   layer.setLayerSelected(activeLayer);
  //   vectorMap.setLayerSelected(activeLayer);
  // }, [activeLayer]);

  composition.setZoom(zoom);
  composition.setPan(panX, panY);

  // layer.setZoom(zoom);
  // layer.setPan(panX, panY);

  // vectorMap.setZoom(zoom);
  // vectorMap.setPan(panX, panY);

  return <WebGLCanvas renderers={renderers} showFPS={showFPS} />;
};

export default CompositionCanvas;
