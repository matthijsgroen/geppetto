import React, { useState } from "react";
import CompositionCanvas from "../animation/CompositionCanvas";
import Menu from "../components/Menu";
import MenuItem from "../components/MenuItem";
import MouseControl, { MouseMode } from "../components/MouseControl";
import SliderControl from "../components/SliderControl";
import { ElementData, ImageDefinition, Keyframe, Vec2 } from "../lib/types";
import ScreenLayout from "../templates/ScreenLayout";

interface CompositionProps {
  imageDefinition: ImageDefinition;
  texture: string;
}

type ControlValues = Record<string, number>;

const mergeVectors = (a: Vec2, b: Vec2 | undefined, mix: number): Vec2 =>
  b === undefined
    ? [a[0] * (1 - mix), a[1] * (1 - mix)]
    : ([a[0] * (1 - mix) + mix * b[0], a[1] * (1 - mix) + mix * b[1]] as Vec2);

const mergeElement = (
  a: ElementData,
  b: ElementData | undefined,
  mix: number
): ElementData =>
  b === undefined
    ? a
    : {
        deformations: Object.entries(a.deformations).reduce(
          (result, [key, value]) => ({
            ...result,
            [key]: mergeVectors(value, result[key], mix),
          }),
          b.deformations
        ),
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
        mergeKeyframes(
          control.min,
          control.max,
          controlValues[control.name] || 0
        ),
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
            keyframe={createKeyframe(controlValues, imageDefinition)}
          />
        </MouseControl>
      }
    />
  );
};

export default Composition;
