import type { GeppettoImage } from "@geppetto/types";
import {
  type FC,
  type PropsWithChildren,
  type RefObject,
  useEffect,
  useMemo,
  useRef,
} from "react";

import useEvent from "@/application/state/hooks/useEvent";
import {
  useControlValues,
  useControlValueSubscription,
  useMutationValues,
} from "@/application/state/ImageControlContext";
import { useScreenTranslation } from "@/application/state/ScreenTranslationContext";
import { newFile } from "@/domain/animation/file2/new";
import { calculateVectorValues } from "@/infrastructure/webgl/lib/vectorPositions";
import WebGLCanvas from "@/infrastructure/webgl/WebGLCanvas";

import { showComposition } from "../programs/showComposition";
import { showCompositionMap } from "../programs/showCompositionMap";
import { showCompositionVectors } from "../programs/showCompositionVectors";

export type CompositionCanvasProps = {
  image: HTMLImageElement | null;
  file: GeppettoImage;
  showWireFrames: boolean;
  activeLayers: string[];
  activeMutation: string | null;
  ref?: RefObject<HTMLDivElement | null>;
};

const shapesChanged = (fileA: GeppettoImage, fileB: GeppettoImage) =>
  fileA.layerHierarchy !== fileB.layerHierarchy ||
  fileA.layerFolders !== fileB.layerFolders ||
  fileA.layers !== fileB.layers ||
  fileA.mutations !== fileB.mutations;

const mutationsControlsChanged = (fileA: GeppettoImage, fileB: GeppettoImage) =>
  fileA.controls !== fileB.controls || fileA.mutations !== fileB.mutations;

const CompositionCanvas: FC<PropsWithChildren<CompositionCanvasProps>> = ({
  image,
  file,
  activeLayers,
  showWireFrames,
  activeMutation,
  children,
  ref,
}) => {
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

  const controlValuesRef = useControlValues();
  const mutationValuesRef = useMutationValues();
  const subscribe = useControlValueSubscription();

  useEffect(() => {
    if (shapesChanged(file, fileRef.current)) {
      composition.setShapes(file);
      compositionMap.setShapes(file);
      vectorMap.setShapes(file);
    }
    if (mutationsControlsChanged(file, fileRef.current)) {
      updateControlValues(file.controlValues, file.defaultFrame);
      mutationValuesRef.current = file.defaultFrame;
      controlValuesRef.current = file.controlValues;
    }
    fileRef.current = file;
  }, [
    file,
    composition,
    compositionMap,
    vectorMap,
    updateControlValues,
    mutationValuesRef,
    controlValuesRef,
  ]);

  useEffect(() => {
    const unsubscribe = subscribe(updateControlValues);
    updateControlValues(controlValuesRef.current, mutationValuesRef.current);
    return unsubscribe;
  }, [controlValuesRef, mutationValuesRef, subscribe, updateControlValues]);

  useEffect(() => {
    compositionMap.setLayerSelected(showWireFrames ? activeLayers : []);
    vectorMap.setLayerSelected(activeLayers);
  }, [activeLayers, compositionMap, vectorMap, showWireFrames]);

  useEffect(() => {
    vectorMap.setActiveMutation(activeMutation);
  }, [activeMutation, vectorMap]);

  return (
    <WebGLCanvas ref={ref} renderers={renderers}>
      {children}
    </WebGLCanvas>
  );
};

export default CompositionCanvas;
