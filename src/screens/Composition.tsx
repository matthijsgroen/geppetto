import React, { useState } from "react";
import CompositionCanvas from "../animation/CompositionCanvas";
import Menu from "../components/Menu";
import MenuItem from "../components/MenuItem";
import MouseControl, { MouseMode } from "../components/MouseControl";
import SliderControl from "../components/SliderControl";
import { ElementData, ImageDefinition, Keyframe } from "../lib/types";
import ScreenLayout from "../templates/ScreenLayout";

interface CompositionProps {
  imageDefinition: ImageDefinition;
  texture: string;
}

type ControlValues = Record<string, number>;

const mergeElement = (
  a: ElementData,
  b: ElementData | undefined,
  mix: number
) => {
  if (b === undefined) {
    return a;
  }
  console.log(mix);
  return b;
};

const mergeKeyframes = (a: Keyframe, b: Keyframe, mix: number): Keyframe =>
  Object.entries(a).reduce(
    (result, [key, value]) => ({
      ...result,
      [key]: mergeElement(value, b[key], mix),
    }),
    {} as Keyframe
  );

const createKeyframe = (
  controlValues: ControlValues,
  imageDefinition: ImageDefinition
) =>
  imageDefinition.controls.reduce(
    (result, control) => ({
      ...result,
      ...mergeKeyframes(
        mergeKeyframes(control.min, control.max, controlValues[control.name]),
        result,
        0.5
      ),
    }),
    {} as Keyframe
  );

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
  const [layerSelected, setLayerSelected] = useState<null | string>(null);
  const [controlValues, setControlValues] = useState<ControlValues>({});

  const mouseMode = MouseMode.Grab;

  const mouseDown = (event: React.MouseEvent) => {
    const canvasPos = event.currentTarget.getBoundingClientRect();
    const elementX = event.pageX - canvasPos.left;
    const elementY = event.pageY - canvasPos.top;
    setIsMouseDown([elementX, elementY]);
  };

  const mouseMove = (event: React.MouseEvent) => {
    if (isMouseDown) {
      const canvasPos = event.currentTarget.getBoundingClientRect();
      const elementX = event.pageX - canvasPos.left;
      const elementY = event.pageY - canvasPos.top;
      setIsMouseDown([elementX, elementY]);
      const deltaX = elementX - isMouseDown[0];
      const deltaY = elementY - isMouseDown[1];

      const newPanX = Math.min(
        1.0,
        Math.max(
          panX + ((deltaX / canvasPos.width) * window.devicePixelRatio) / zoom,
          -1.0
        )
      );
      setPanX(newPanX);

      const newPanY = Math.min(
        1.0,
        Math.max(
          panY +
            ((deltaY / canvasPos.height) * window.devicePixelRatio * -1.0) /
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
    const z = Math.min(4.0, Math.max(0.1, zoom - delta / 100));
    setZoom(z);
  };

  return (
    <ScreenLayout
      menus={[
        <Menu title="Composition" key="layers">
          {imageDefinition.shapes.map((shape) => (
            <MenuItem
              key={shape.name}
              selected={shape.name === layerSelected}
              name={`${shape.name} (${shape.points.length})`}
              onClick={() =>
                setLayerSelected(
                  shape.name === layerSelected ? null : shape.name
                )
              }
            />
          ))}
        </Menu>,
        <Menu title="Controls" key="controls">
          {imageDefinition.controls.map((control) => (
            <SliderControl
              key={control.name}
              title={control.name}
              value={controlValues[control.name] || 0}
              min={0}
              max={1}
              step={0.01}
              onChange={(newValue) => {
                setControlValues((controlValues) => ({
                  ...controlValues,
                  [control.name]: newValue,
                }));
              }}
            />
          ))}
          {JSON.stringify(createKeyframe(controlValues, imageDefinition))}
        </Menu>,
      ]}
      main={
        <MouseControl
          mode={mouseMode}
          onMouseDown={mouseDown}
          onMouseMove={mouseMove}
          onMouseUp={mouseUp}
          onWheel={mouseWheel}
        >
          <CompositionCanvas
            url={texture}
            shapes={imageDefinition.shapes}
            zoom={zoom}
            panX={panX}
            panY={panY}
            activeLayer={layerSelected}
          />
        </MouseControl>
      }
    />
  );
};

export default Composition;
