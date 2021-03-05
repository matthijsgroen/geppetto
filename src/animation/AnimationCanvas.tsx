import React, { useEffect, useMemo } from "react";
import { ImageDefinition } from "../lib/types";
import { showComposition } from "./programs/showComposition";
import WebGLCanvas from "./WebGLCanvas";

export interface TextureMapCanvasProps {
  image: HTMLImageElement | null;
  imageDefinition: ImageDefinition;
  zoom: number;
  panX: number;
  panY: number;
}

const AnimationCanvas: React.FC<TextureMapCanvasProps> = ({
  image,
  imageDefinition,
  zoom,
  panX,
  panY,
}) => {
  const composition = useMemo(() => showComposition(), []);
  const renderers = [composition.renderer];

  useEffect(() => {
    if (image) {
      composition.setImage(image);
    }
  }, [image]);

  useEffect(() => {
    composition.setShapes(imageDefinition.shapes);
  }, [imageDefinition.shapes]);

  useEffect(() => {
    composition.setVectorValues(imageDefinition.defaultFrame);
  }, [imageDefinition.defaultFrame]);

  composition.setZoom(zoom);
  composition.setPan(panX, panY);

  return <WebGLCanvas renderers={renderers} />;
};

export default AnimationCanvas;
