import React, { Dispatch, SetStateAction, useState } from "react";
import AnimationCanvas from "src/animation/AnimationCanvas";
import Menu from "src/components/Menu";
import SliderControl from "src/components/SliderControl";
import { TimeContainer } from "src/components/TimeContainer";
import { omitKeys } from "src/lib/definitionHelpers";
import { maxZoomFactor } from "src/lib/webgl";
import MouseControl, { MouseMode } from "../components/MouseControl";
import { ControlValues, ImageDefinition } from "../lib/types";
import ScreenLayout from "../templates/ScreenLayout";

interface CompositionProps {
  imageDefinition: ImageDefinition;
  texture: HTMLImageElement | null;
  updateImageDefinition: Dispatch<SetStateAction<ImageDefinition>>;
}

const Animation: React.VFC<CompositionProps> = ({
  texture,
  imageDefinition,
  updateImageDefinition,
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

  const controlValues = imageDefinition.controlValues;
  const setControlValues = (
    mutation: (current: ControlValues) => ControlValues
  ) => {
    updateImageDefinition((image) => ({
      ...image,
      controlValues: mutation(image.controlValues),
    }));
  };

  const [selectedAnimation, setSelectedAnimation] = useState<string | null>(
    null
  );
  const [selectedFrame, setSelectedFrame] = useState<number | null>(null);

  const frameControlValues =
    selectedAnimation && selectedFrame
      ? imageDefinition.animations
          .find((e) => e.name === selectedAnimation)
          ?.keyframes.find((f) => f.time === selectedFrame)?.controlValues ||
        null
      : null;

  const frameControlKeys = Object.keys(frameControlValues || {});
  const setFrameControlValues = (
    mutation: (current: ControlValues) => ControlValues
  ) => {
    updateImageDefinition((image) => ({
      ...image,
      animations: image.animations.map((a) =>
        a.name === selectedAnimation
          ? {
              ...a,
              keyframes: a.keyframes.map((f) =>
                f.time === selectedFrame
                  ? { ...f, controlValues: mutation(f.controlValues) }
                  : f
              ),
            }
          : a
      ),
    }));
  };

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
          <AnimationCanvas
            image={texture}
            imageDefinition={imageDefinition}
            controlValues={{ ...controlValues, ...frameControlValues }}
            zoom={zoom}
            panX={panX}
            panY={panY}
          />
        </MouseControl>
      }
      menus={[
        <Menu
          title="Animation"
          key="layers"
          collapsable={true}
          size={"large"}
          items={imageDefinition.controls.map((control, i) => (
            <SliderControl
              key={`control${i}`}
              title={control.name}
              value={
                frameControlValues && frameControlKeys.includes(control.name)
                  ? frameControlValues[control.name]
                  : controlValues[control.name]
              }
              min={0}
              selected={frameControlKeys.includes(control.name)}
              max={control.steps.length - 1}
              step={0.01 * (control.steps.length - 1)}
              onSelect={() => {
                if (frameControlKeys.includes(control.name)) {
                  setFrameControlValues((f) => omitKeys(f, [control.name]));
                } else {
                  setFrameControlValues((f) => ({
                    ...f,
                    [control.name]: controlValues[control.name],
                  }));
                }
              }}
              onChange={(newValue) => {
                if (frameControlKeys.includes(control.name)) {
                  setFrameControlValues((f) => ({
                    ...f,
                    [control.name]: newValue,
                  }));
                } else {
                  setControlValues((state) => ({
                    ...state,
                    [control.name]: newValue,
                  }));
                }
              }}
            />
          ))}
        />,
      ]}
      bottom={
        <TimeContainer
          selectedAnimation={selectedAnimation}
          updateSelectedAnimation={setSelectedAnimation}
          selectedFrame={selectedFrame}
          updateSelectedFrame={setSelectedFrame}
          imageDefinition={imageDefinition}
          updateImageDefinition={updateImageDefinition}
        />
      }
    />
  );
};

export default Animation;
