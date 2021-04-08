import React, { useEffect, useMemo, useState } from "react";
import { WebGLRenderer } from "src/lib/webgl";
import { ControlValues, ImageDefinition, PlayStatus } from "../lib/types";
// import { showAnimation } from "./programs/showAnimation";
import WebGLCanvas from "./WebGLCanvas";
import {
  AnimationControls,
  createPlayer,
  GeppettoPlayer,
  prepareAnimation,
} from "geppetto-player";

export interface AnimationCanvasProps {
  image: HTMLImageElement | null;
  imageDefinition: ImageDefinition;
  controlValues: ControlValues;
  playStatus?: PlayStatus;
  zoom: number;
  panX: number;
  panY: number;
  showFPS?: boolean;
}

const playerIntegration = () => {
  let animation: AnimationControls | null = null;
  let player: GeppettoPlayer;
  let zoom = 1;
  let panX = 0;
  let panY = 0;
  let internalControlValues: ControlValues = {};

  const renderer: WebGLRenderer = (gl) => {
    const canvas = gl.canvas as HTMLCanvasElement;
    player = createPlayer(canvas);

    return {
      render() {
        player.render();
        if (animation) {
          animation.render();
        }
      },
      cleanup() {
        player.destroy();
      },
    };
  };
  let controlNames: string[] = [];

  return {
    renderer,
    setAnimation(image: HTMLImageElement, imageDefinition: ImageDefinition) {
      controlNames = imageDefinition.controls.map((c) => c.name);
      if (animation !== null) {
        animation.destroy();
      }
      animation = player.addAnimation(
        prepareAnimation(imageDefinition),
        image,
        1,
        {
          zoom,
          panX,
          panY,
        }
      );
    },
    setZoom(newZoom: number) {
      zoom = newZoom;
      animation && animation.setZoom(zoom);
    },
    setPan(x: number, y: number) {
      panX = x;
      panY = y;
      animation && animation.setPanning(x, y);
    },
    setControlValues(values: ControlValues) {
      if (animation) {
        for (const key in values) {
          if (
            controlNames.includes(key) &&
            internalControlValues[key] !== values[key]
          ) {
            animation.setControlValue(key, values[key]);
          }
        }
      }
      internalControlValues = { ...values };
    },
  };
};

const AnimationCanvas: React.FC<AnimationCanvasProps> = ({
  image,
  imageDefinition,
  controlValues,
  // playStatus = {},
  zoom,
  panX,
  panY,
  showFPS,
}) => {
  const animation = useMemo(playerIntegration, []);

  const [cleanImageDefinition, setCleanImageDefintion] = useState(
    imageDefinition
  );

  useEffect(() => {
    const updatedDef: ImageDefinition = {
      ...imageDefinition,
      controlValues: cleanImageDefinition.controlValues,
    };
    if (JSON.stringify(updatedDef) !== JSON.stringify(cleanImageDefinition)) {
      setCleanImageDefintion(imageDefinition);
    }
  }, [imageDefinition, setCleanImageDefintion]);

  useEffect(() => {
    if (image && imageDefinition) {
      animation.setAnimation(image, imageDefinition);
    }
  }, [image, cleanImageDefinition]);

  useEffect(() => {
    animation.setControlValues(controlValues);
  }, [controlValues]);

  // useEffect(() => {
  //   animation.setPlayStatus(playStatus);
  // }, [playStatus]);

  animation.setZoom(zoom);
  animation.setPan(panX, panY);

  return <WebGLCanvas renderers={[animation.renderer]} showFPS={showFPS} />;
};

export default AnimationCanvas;
