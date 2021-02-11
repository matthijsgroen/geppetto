import React, { useCallback, useEffect, useState } from "react";
import { mergeVec2 } from "src/lib/vertices";
import CompositionCanvas from "../animation/CompositionCanvas";
import Menu from "../components/Menu";
import MouseControl, { MouseMode } from "../components/MouseControl";
import ShapeList from "../components/ShapeList";
import SliderControl from "../components/SliderControl";
import ToolbarButton from "../components/ToolbarButton";
import {
  addFolder,
  canMoveDown,
  canMoveUp,
  getLayerNames,
  getShape,
  getVector,
  makeLayerName,
  moveDown,
  moveUp,
  rename,
} from "../lib/definitionHelpers";
import {
  ElementData,
  ImageDefinition,
  ItemSelection,
  Keyframe,
  MutationVector,
  ShapeDefinition,
} from "../lib/types";
import ScreenLayout from "../templates/ScreenLayout";
import LayerInfoPanel from "./LayerInfoPanel";
import VectorInfoPanel from "./VectorInfoPanel";

interface CompositionProps {
  imageDefinition: ImageDefinition;
  texture: HTMLImageElement | null;
  updateImageDefinition(
    mutator: (previousImageDefinition: ImageDefinition) => ImageDefinition
  ): void;
}

type ControlValues = Record<string, number>;

const mergeElement = (
  a: ElementData,
  b: ElementData | undefined,
  mix: number
): ElementData =>
  b === undefined
    ? a
    : {
        deformations: Object.entries(a.deformations || {}).reduce(
          (result, [key, value]) => ({
            ...result,
            [key]: mergeVec2(value, result[key], mix),
          }),
          b.deformations || {}
        ),
        translate: mergeVec2(a.translate, b.translate, mix),
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
  updateImageDefinition,
}) => {
  const [zoom, setZoom] = useState(1.0);
  const [panX, setPanX] = useState(0.0);
  const [panY, setPanY] = useState(0.0);
  const [isMouseDown, setIsMouseDown] = useState<false | [number, number]>(
    false
  );
  const [layerSelected, setLayerSelected] = useState<null | ItemSelection>(
    null
  );
  const [controlValues, setControlValues] = useState<ControlValues>({});

  const setItemSelected = useCallback(
    (item: ShapeDefinition | MutationVector | null) => {
      setLayerSelected(
        item === null
          ? null
          : {
              name: item.name,
              type:
                item.type === "folder" || item.type === "sprite"
                  ? "layer"
                  : "vector",
            }
      );
    },
    [setLayerSelected]
  );

  const mouseMode = MouseMode.Grab;
  const shapeSelected =
    layerSelected === null || layerSelected.type !== "layer"
      ? null
      : getShape(imageDefinition.shapes, layerSelected.name);
  const vectorSelected =
    layerSelected === null || layerSelected.type !== "vector"
      ? null
      : getVector(imageDefinition.shapes, layerSelected.name);

  useEffect(() => {
    if (!layerSelected) {
      return;
    }
    if (layerSelected.type === "layer") {
      const names = getLayerNames(imageDefinition.shapes);
      if (!names.includes(layerSelected.name)) {
        setItemSelected(null);
      }
    }
    // TODO: Add same path for vector
  }, [imageDefinition]);

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
        <Menu
          title="Composition"
          key="layers"
          collapsable={true}
          size={"large"}
          toolbarItems={[
            <ToolbarButton
              key="1"
              icon="⚪️"
              label="+"
              size="small"
              disabled={layerSelected === null}
              onClick={async () => {
                // const newFolder = await addFolder(
                //   updateImageDefinition,
                //   "New Folder"
                // );
                // setItemSelected(newFolder);
              }}
            />,
            <ToolbarButton
              key="2"
              icon="📁"
              label="+"
              size="small"
              onClick={async () => {
                const newFolder = await addFolder(
                  updateImageDefinition,
                  "New Folder"
                );
                setItemSelected(newFolder);
              }}
            />,
            <ToolbarButton
              key="3"
              icon="⬆"
              disabled={!canMoveUp(layerSelected, imageDefinition)}
              label=""
              size="small"
              onClick={() => {
                if (layerSelected === null) {
                  return;
                }
                updateImageDefinition((state) => moveUp(layerSelected, state));
              }}
            />,
            <ToolbarButton
              key="4"
              icon="⬇"
              disabled={!canMoveDown(layerSelected, imageDefinition)}
              label=""
              size="small"
              onClick={() => {
                if (layerSelected === null) {
                  return;
                }
                updateImageDefinition((state) =>
                  moveDown(layerSelected, state)
                );
              }}
            />,
          ]}
          items={
            <ShapeList
              shapes={imageDefinition.shapes}
              layerSelected={layerSelected}
              setItemSelected={setItemSelected}
              showMutationVectors={true}
              onRename={(oldName, newName, item) => {
                const layerName = makeLayerName(
                  imageDefinition,
                  newName,
                  layerSelected ? layerSelected.name : null
                );
                updateImageDefinition((state) =>
                  rename(state, oldName, layerName)
                );
                setLayerSelected({
                  name: layerName,
                  type:
                    item.type === "folder" || item.type === "sprite"
                      ? "layer"
                      : "vector",
                });
              }}
            />
          }
        />,
        shapeSelected ? (
          <LayerInfoPanel
            key="info"
            shapeSelected={shapeSelected}
            updateImageDefinition={updateImageDefinition}
          />
        ) : vectorSelected ? (
          <VectorInfoPanel
            key="info"
            vectorSelected={vectorSelected}
            updateImageDefinition={updateImageDefinition}
          />
        ) : (
          <Menu
            title={"Info"}
            key="info"
            collapsable={true}
            size="minimal"
            items={[]}
          />
        ),
        <Menu
          title="Controls"
          key="controls"
          collapsable={true}
          items={imageDefinition.controls.map((control) => (
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
        />,
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
            image={texture}
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
