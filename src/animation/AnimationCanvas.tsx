import React, { useEffect, useMemo, useState } from "react";
import { ControlValues, ImageDefinition, PlayStatus } from "../lib/types";
import { showAnimation } from "./programs/showAnimation";
import WebGLCanvas from "./WebGLCanvas";

export interface TextureMapCanvasProps {
  image: HTMLImageElement | null;
  imageDefinition: ImageDefinition;
  controlValues: ControlValues;
  playStatus?: PlayStatus;
  zoom: number;
  panX: number;
  panY: number;
}

const AnimationCanvas: React.FC<TextureMapCanvasProps> = ({
  image,
  imageDefinition,
  controlValues,
  playStatus = {},
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
    animation.setControlValues(controlValues);
  }, [imageDefinition]);

  useEffect(() => {
    animation.setPlayStatus(playStatus);
  }, [playStatus]);

  animation.setControlValues(controlValues);
  animation.setZoom(zoom);
  animation.setPan(panX, panY);

  return <WebGLCanvas renderers={renderers} />;
};

export default AnimationCanvas;
