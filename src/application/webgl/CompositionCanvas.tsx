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
  showWireFrames: boolean;
  vectorValues: GeppettoImage["defaultFrame"];
  activeLayers: string[];
  activeMutation: string | null;
}

const shapesChanged = (fileA: GeppettoImage, fileB: GeppettoImage) =>
  fileA.layerHierarchy !== fileB.layerHierarchy ||
  fileA.layerFolders !== fileB.layerFolders ||
  fileA.layers !== fileB.layers ||
  fileA.mutations !== fileB.mutations;

const CompositionCanvas = forwardRef<
  HTMLDivElement,
  PropsWithChildren<CompositionCanvasProps>
>(
  (
    {
      image,
      file,
      vectorValues,
      activeLayers,
      showWireFrames,
      activeMutation,
      children,
    },
    ref
  ) => {
    const translation = useScreenTranslation();
    const composition = useMemo(
      () => showComposition(translation),
      [translation]
    );
    const compositionMap = useMemo(
      () => showCompositionMap(translation),
      [translation]
    );
    const vectorMap = useMemo(
      () => showCompositionVectors(translation),
      [translation]
    );
    const renderers = useMemo(
      () => [composition.renderer, compositionMap.renderer, vectorMap.renderer],
      [composition.renderer, compositionMap.renderer, vectorMap.renderer]
    );

    useEffect(() => {
      if (image) {
        composition.setImage(image);
        compositionMap.setImage(image);
        vectorMap.setImage(image);
      }
    }, [image, composition, compositionMap, vectorMap]);

    const fileRef = useRef(newFile());

    useEffect(() => {
      if (shapesChanged(file, fileRef.current)) {
        composition.setShapes(file);
        compositionMap.setShapes(file);
        vectorMap.setShapes(file);
      }
      fileRef.current = file;
    }, [file, composition, compositionMap, vectorMap]);

    useEffect(() => {
      composition.setVectorValues(vectorValues);
      compositionMap.setVectorValues(vectorValues);
      vectorMap.setVectorValues(vectorValues);
    }, [vectorValues, composition, compositionMap, vectorMap]);

    useEffect(() => {
      compositionMap.setLayerSelected(showWireFrames ? activeLayers : []);
      vectorMap.setLayerSelected(activeLayers);
    }, [activeLayers, compositionMap, vectorMap, showWireFrames]);

    useEffect(() => {
      vectorMap.setActiveMutation(activeMutation);
    }, [activeMutation, vectorMap]);

    return (
      <WebGLCanvas renderers={renderers} ref={ref}>
        {children}
      </WebGLCanvas>
    );
  }
);

export default CompositionCanvas;
