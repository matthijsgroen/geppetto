import React, { useEffect, useMemo } from "react";
import { ControlValues, ImageDefinition } from "../lib/types";
import { showAnimation } from "./programs/showAnimation";
import WebGLCanvas from "./WebGLCanvas";

export interface TextureMapCanvasProps {
  image: HTMLImageElement | null;
  imageDefinition: ImageDefinition;
  controlValues: ControlValues;
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
  const animation = useMemo(() => showAnimation(), []);
  const renderers = [animation.renderer];

  useEffect(() => {
    if (image) {
      animation.setImage(image);
    }
  }, [image]);

  useEffect(() => {
    animation.setImageDefinition(imageDefinition);
  }, [imageDefinition]);

  animation.setZoom(zoom);
  animation.setPan(panX, panY);

  return <WebGLCanvas renderers={renderers} />;
};

export default AnimationCanvas;
