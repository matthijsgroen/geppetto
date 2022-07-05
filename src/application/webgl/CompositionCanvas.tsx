import React, {
  forwardRef,
  PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { newFile } from "../../animation/file2/new";
import { GeppettoImage } from "../../animation/file2/types";
import {
  useControlValues,
  useControlValueSubscription,
  useMutationValues,
} from "../contexts/ImageControlContext";
import { useScreenTranslation } from "../contexts/ScreenTranslationContext";
import useEvent from "../hooks/useEvent";
import { calculateVectorValues } from "./lib/vectorPositions";
import { showComposition } from "./programs/showComposition";
import { showCompositionMap } from "./programs/showCompositionMap";
import { showCompositionVectors } from "./programs/showCompositionVectors";
import WebGLCanvas from "./WebGLCanvas";

export interface CompositionCanvasProps {
  image: HTMLImageElement | null;
  file: GeppettoImage;
  showWireFrames: boolean;
  activeLayers: string[];
  activeMutation: string | null;
}

const shapesChanged = (fileA: GeppettoImage, fileB: GeppettoImage) =>
  fileA.layerHierarchy !== fileB.layerHierarchy ||
  fileA.layerFolders !== fileB.layerFolders ||
  fileA.layers !== fileB.layers ||
  fileA.mutations !== fileB.mutations;

const mutationsControlsChanged = (fileA: GeppettoImage, fileB: GeppettoImage) =>
  fileA.controls !== fileB.controls || fileA.mutations !== fileB.mutations;

const CompositionCanvas = forwardRef<
  HTMLDivElement,
  PropsWithChildren<CompositionCanvasProps>
>(
  (
    { image, file, activeLayers, showWireFrames, activeMutation, children },
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

    const updateControlValues = useEvent(
      (
        controlValues: GeppettoImage["controlValues"],
        mutationValues: GeppettoImage["defaultFrame"]
      ) => {
        const vectorValues = calculateVectorValues(
          fileRef.current,
          mutationValues,
          controlValues
        );
        composition.setVectorValues(vectorValues);
        compositionMap.setVectorValues(vectorValues);
        vectorMap.setVectorValues(vectorValues);
      }
    );

    const controlValues = useControlValues();
    const mutationValues = useMutationValues();
    const subscribe = useControlValueSubscription();

    useEffect(() => {
      if (shapesChanged(file, fileRef.current)) {
        composition.setShapes(file);
        compositionMap.setShapes(file);
        vectorMap.setShapes(file);
      }
      if (mutationsControlsChanged(file, fileRef.current)) {
        updateControlValues(file.controlValues, file.defaultFrame);
        mutationValues.current = file.defaultFrame;
        controlValues.current = file.controlValues;
      }
      fileRef.current = file;
    }, [
      file,
      composition,
      compositionMap,
      vectorMap,
      updateControlValues,
      mutationValues,
      controlValues,
    ]);

    useEffect(() => {
      const unsubscribe = subscribe(updateControlValues);
      updateControlValues(controlValues.current, mutationValues.current);
      return unsubscribe;
    }, [controlValues, mutationValues, subscribe, updateControlValues]);

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
