import React, { useEffect, useMemo, useRef } from "react";
import { newFile } from "../../animation/file2/new";
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

const shapesChanged = (fileA: GeppettoImage, fileB: GeppettoImage) =>
  fileA.layerFolders !== fileB.layerFolders ||
  fileA.layers !== fileB.layers ||
  fileA.mutations !== fileB.mutations;

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

  const fileRef = useRef(newFile());

  useEffect(() => {
    if (shapesChanged(file, fileRef.current)) {
      composition.setShapes(file);
      layer.setShapes(file);
      vectorMap.setShapes(file);
    }
    fileRef.current = file;
  }, [file, composition, layer, vectorMap]);

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
