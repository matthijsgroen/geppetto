import React, {
  forwardRef,
  PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { newFile } from "../../animation/file2/new";
import { GeppettoImage } from "../../animation/file2/types";
import { useScreenTranslation } from "../contexts/ScreenTranslationContext";
import { showComposition } from "./programs/showComposition";
import { showCompositionMap } from "./programs/showCompositionMap";
import { showCompositionVectors } from "./programs/showCompositionVectors";
import WebGLCanvas from "./WebGLCanvas";

export interface CompositionCanvasProps {
  image: HTMLImageElement | null;
  file: GeppettoImage;
  vectorValues: GeppettoImage["defaultFrame"];
  activeLayers: string[];
}

const shapesChanged = (fileA: GeppettoImage, fileB: GeppettoImage) =>
  fileA.layerFolders !== fileB.layerFolders ||
  fileA.layers !== fileB.layers ||
  fileA.mutations !== fileB.mutations;

const CompositionCanvas = forwardRef<
  HTMLDivElement,
  PropsWithChildren<CompositionCanvasProps>
>(({ image, file, vectorValues, activeLayers, children }, ref) => {
  const translation = useScreenTranslation();
  const composition = useMemo(
    () => showComposition(translation),
    [translation]
  );
  const layer = useMemo(() => showCompositionMap(translation), [translation]);
  const vectorMap = useMemo(
    () => showCompositionVectors(translation),
    [translation]
  );
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

  return (
    <WebGLCanvas renderers={renderers} ref={ref}>
      {children}
    </WebGLCanvas>
  );
});

export default CompositionCanvas;
