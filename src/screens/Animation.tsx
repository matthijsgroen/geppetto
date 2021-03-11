import React, { Dispatch, SetStateAction, useState } from "react";
import AnimationCanvas from "src/animation/AnimationCanvas";
import Menu from "src/components/Menu";
import NumberInputControl from "src/components/NumberInputControl";
import SliderControl from "src/components/SliderControl";
import { TimeContainer } from "src/components/TimeContainer";
import { omitKeys } from "src/lib/definitionHelpers";
import { maxZoomFactor } from "src/lib/webgl";
import MouseControl, { MouseMode } from "../components/MouseControl";
import {
  AnimationFrame,
  ControlValues,
  ImageDefinition,
  PlayStatus,
} from "../lib/types";
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

  const [playStatus, setPlayStatus] = useState<PlayStatus>({});

  const activeFrame =
    selectedAnimation && selectedFrame !== null
      ? imageDefinition.animations
          .find((e) => e.name === selectedAnimation)
          ?.keyframes.find((f) => f.time === selectedFrame) || null
      : null;

  const frameControlKeys = Object.keys(activeFrame?.controlValues || {});
  const updateFrame = (
    mutation: (current: AnimationFrame) => AnimationFrame
  ) => {
    updateImageDefinition((image) => ({
      ...image,
      animations: image.animations.map((a) =>
        a.name === selectedAnimation
          ? {
              ...a,
              keyframes: a.keyframes
                .map((f) => (f === activeFrame ? mutation(f) : f))
                .sort((a, b) => a.time - b.time),
            }
          : a
      ),
    }));
  };

  const setFrameControlValues = (
    mutation: (current: ControlValues) => ControlValues
  ) => updateFrame((f) => ({ ...f, controlValues: mutation(f.controlValues) }));

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
            controlValues={{ ...controlValues, ...activeFrame?.controlValues }}
            playStatus={playStatus}
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
                activeFrame && frameControlKeys.includes(control.name)
                  ? activeFrame.controlValues[control.name]
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
        <Menu
          title={"Frame Info"}
          key="info"
          collapsable={true}
          size="minimal"
          items={
            activeFrame
              ? [
                  <NumberInputControl
                    key={"time"}
                    title={"time"}
                    value={activeFrame.time}
                    onChange={(newValue) => {
                      updateFrame((f) => ({
                        ...f,
                        time: Math.max(newValue, 0),
                      }));
                      setSelectedFrame(newValue);
                    }}
                  />,
                ]
              : []
          }
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
          playStatus={playStatus}
          updatePlayStatus={setPlayStatus}
        />
      }
    />
  );
};

export default Animation;
