import React, { useEffect, useState } from "react";
import { TimeContainer } from "src/components/TimeContainer";
import { maxZoomFactor } from "src/lib/webgl";
import CompositionCanvas from "../animation/CompositionCanvas";
import MouseControl, { MouseMode } from "../components/MouseControl";
import { ImageDefinition, Keyframe } from "../lib/types";
import ScreenLayout from "../templates/ScreenLayout";

interface CompositionProps {
  imageDefinition: ImageDefinition;
  texture: HTMLImageElement | null;
  updateImageDefinition(
    mutator: (previousImageDefinition: ImageDefinition) => ImageDefinition
  ): void;
}

const Composition: React.FC<CompositionProps> = ({
  texture,
  imageDefinition,
}) => {
  const [zoom, setZoom] = useState(1.0);
  const [panX, setPanX] = useState(0.0);
  const [panY, setPanY] = useState(0.0);
  const [isMouseDown, setIsMouseDown] = useState<false | [number, number]>(
    false
  );
  const [mouseMoveDelta, setMouseMoveDelta] = useState<[number, number]>([
    0,
    0,
  ]);
  const [vectorValues, setVectorValues] = useState<Keyframe>({});

  useEffect(() => {
    const newVectorValues = {
      ...vectorValues,
      ...imageDefinition.defaultFrame,
    };
    if (JSON.stringify(vectorValues) !== JSON.stringify(newVectorValues)) {
      setVectorValues(newVectorValues);
    }
  }, [imageDefinition]);

  const mouseMode = MouseMode.Grab;
  const mouseDown = (event: React.MouseEvent) => {
    const canvasPos = event.currentTarget.getBoundingClientRect();
    const elementX = event.pageX - canvasPos.left;
    const elementY = event.pageY - canvasPos.top;
    setIsMouseDown([elementX, elementY]);
    setMouseMoveDelta([0, 0]);
  };

  const mouseMove = (event: React.MouseEvent) => {
    if (isMouseDown) {
      const canvasPos = event.currentTarget.getBoundingClientRect();
      const elementX = event.pageX - canvasPos.left;
      const elementY = event.pageY - canvasPos.top;

      const deltaX = elementX - isMouseDown[0];
      const deltaY = elementY - isMouseDown[1];
      setMouseMoveDelta([deltaX, deltaY]);

      const newPanX = Math.min(
        1.0,
        Math.max(
          panX +
            (((deltaX - mouseMoveDelta[0]) / canvasPos.width) *
              window.devicePixelRatio) /
              zoom,
          -1.0
        )
      );
      setPanX(newPanX);

      const newPanY = Math.min(
        1.0,
        Math.max(
          panY +
            (((deltaY - mouseMoveDelta[1]) / canvasPos.height) *
              window.devicePixelRatio *
              -1.0) /
              zoom,
          -1.0
        )
      );
      setPanY(newPanY);
    }
  };

  const mouseUp = () => {
    setIsMouseDown(false);
  };

  const mouseWheel = (delta: number) => {
    const z = Math.min(
      maxZoomFactor(texture),
      Math.max(0.1, zoom - delta / 100)
    );
    setZoom(z);
  };

  return (
    <ScreenLayout
      main={
        <MouseControl
          mode={mouseMode}
          onMouseDown={mouseDown}
          onMouseMove={mouseMove}
          onMouseUp={mouseUp}
          onWheel={mouseWheel}
        >
          <CompositionCanvas
            image={texture}
            shapes={imageDefinition.shapes}
            vectorValues={vectorValues}
            zoom={zoom}
            panX={panX}
            panY={panY}
          />
        </MouseControl>
      }
      bottom={<TimeContainer />}
    />
  );
};

export default Composition;
