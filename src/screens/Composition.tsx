import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import MenuItem from "src/components/MenuItem";
import {
  combineKeyFrames,
  defaultValueForVector,
  mixVec2,
} from "src/lib/vertices";
import { isControlDefinition, isMutationVector, visit } from "src/lib/visit";
import { maxZoomFactor } from "src/lib/webgl";
import CompositionCanvas from "../animation/CompositionCanvas";
import Menu from "../components/Menu";
import MouseControl, { MouseMode } from "../components/MouseControl";
import ShapeList from "../components/ShapeList";
import ToolbarButton from "../components/ToolbarButton";
import {
  addControl,
  addFolder,
  addVector,
  canDelete,
  canMoveDown,
  canMoveUp,
  getLayerNames,
  getShape,
  getVector,
  makeControlName,
  makeLayerName,
  makeVectorName,
  moveDown,
  moveUp,
  removeItem,
  renameControl,
  renameLayer,
  renameVector,
} from "../lib/definitionHelpers";
import {
  ControlDefinition,
  ImageDefinition,
  ItemSelection,
  Keyframe,
  MutationVector,
  ShapeDefinition,
} from "../lib/types";
import ScreenLayout from "../templates/ScreenLayout";
import ControlInfoPanel from "./ControlInfoPanel";
import LayerInfoPanel from "./LayerInfoPanel";
import VectorInfoPanel from "./VectorInfoPanel";

interface CompositionProps {
  imageDefinition: ImageDefinition;
  texture: HTMLImageElement | null;
  updateImageDefinition: Dispatch<SetStateAction<ImageDefinition>>;
  showFPS?: boolean;
}

type ControlMode = {
  control: string;
  step: number;
};

const getSetVectorNames = (
  imageDefinition: ImageDefinition,
  mode: ControlMode
): string[] => {
  const control = imageDefinition.controls.find((c) => c.name === mode.control);
  if (control === undefined) return [];
  const f = Math.min(control.steps.length - 1, mode.step);
  return Object.keys(control.steps[f]);
};

const getMutationVectorMapping = (
  imageDefinition: ImageDefinition
): Record<string, MutationVector> => {
  const mapping: Record<string, MutationVector> = {};
  visit(imageDefinition, (item) => {
    if (isMutationVector(item)) {
      mapping[item.name] = item;
    }
    return undefined;
  });
  return mapping;
};

const Composition: React.VFC<CompositionProps> = ({
  texture,
  imageDefinition,
  updateImageDefinition,
  showFPS,
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
  const [layerSelected, setLayerSelected] = useState<null | ItemSelection>(
    null
  );
  const [controlMode, setControlmode] = useState<null | ControlMode>(null);

  const setItemSelected = useCallback(
    (item: ShapeDefinition | MutationVector | ControlDefinition | null) => {
      setLayerSelected(
        item === null
          ? null
          : {
              name: item.name,
              type:
                item.type === "folder" || item.type === "sprite"
                  ? "layer"
                  : item.type === "slider"
                  ? "control"
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
      : getShape(imageDefinition, layerSelected.name);
  const vectorSelected =
    layerSelected === null || layerSelected.type !== "vector"
      ? null
      : getVector(imageDefinition, layerSelected.name);

  const controlSelected = controlMode
    ? imageDefinition.controls.find((c) => c.name === controlMode.control)
    : layerSelected === null || layerSelected.type !== "control"
    ? null
    : imageDefinition.controls.find((c) => c.name === layerSelected.name) ||
      null;

  const controlModeStep =
    controlSelected && controlMode
      ? Math.min(controlSelected.steps.length - 1, controlMode.step)
      : 0;

  if (
    controlSelected &&
    controlMode &&
    controlMode.step > controlSelected.steps.length - 1
  ) {
    setControlmode({
      control: controlSelected.name,
      step: controlSelected.steps.length - 1,
    });
  }

  const activeControlValues: Keyframe | null =
    controlSelected && controlMode
      ? controlSelected.steps[controlModeStep]
      : null;

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

  const defaultFrameValues: Keyframe =
    (imageDefinition && imageDefinition.defaultFrame) || {};

  const vectorMapping = getMutationVectorMapping(imageDefinition);

  const vectorValues: Keyframe = Object.entries(
    imageDefinition.controlValues
  ).reduce((result, [key, value]) => {
    const control = imageDefinition.controls.find((c) => c.name === key);
    if (!control) return result;
    const keys = control.steps.reduce<string[]>(
      (result, step) =>
        result.concat(Object.keys(step).filter((e) => !result.includes(e))),
      [] as string[]
    );
    const startStep = Math.floor(value);
    const endStep = Math.ceil(value);
    const mixValue = value - startStep;

    const mixed = keys.reduce((result, vectorKey) => {
      const min =
        control.steps[startStep][vectorKey] ||
        defaultValueForVector(vectorMapping[vectorKey].type);
      const max =
        control.steps[endStep][vectorKey] ||
        defaultValueForVector(vectorMapping[vectorKey].type);

      const vectorValue = mixVec2(min, max, mixValue);
      return { ...result, [vectorKey]: vectorValue };
    }, {} as Keyframe);
    return combineKeyFrames(result, mixed, vectorMapping);
  }, defaultFrameValues);

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

      if ((shapeSelected || vectorSelected) && event.shiftKey) {
        updateImageDefinition((image) =>
          visit(image, (item, parents) => {
            if (
              shapeSelected &&
              item.type === "sprite" &&
              ((shapeSelected.type === "sprite" &&
                item.name === shapeSelected.name) ||
                (shapeSelected.type === "folder" &&
                  parents.find(
                    (e) => e.type === "folder" && e.name === shapeSelected.name
                  )))
            ) {
              return {
                ...item,
                translate: [
                  Math.round(
                    item.translate[0] + (deltaX - mouseMoveDelta[0]) / zoom
                  ),
                  Math.round(
                    item.translate[1] + (deltaY - mouseMoveDelta[1]) / zoom
                  ),
                ],
              };
            }
            if (
              isMutationVector(item) &&
              ((vectorSelected && item.name === vectorSelected.name) ||
                (shapeSelected &&
                  parents.find((e) => e.name === shapeSelected.name)))
            ) {
              return {
                ...item,
                origin: [
                  Math.round(
                    item.origin[0] + (deltaX - mouseMoveDelta[0]) / zoom
                  ),
                  Math.round(
                    item.origin[1] + (deltaY - mouseMoveDelta[1]) / zoom
                  ),
                ],
              };
            }

            return undefined;
          })
        );
        return;
      }
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
      tools={[
        <ToolbarButton
          key="move"
          hint="Move mode"
          icon="✋"
          active={controlMode === null}
          label=""
          onClick={() => {
            if (controlMode !== null) {
              setControlmode(null);
              setLayerSelected({
                name: controlMode.control,
                type: "control",
              });
            }
          }}
        />,
        <ToolbarButton
          key="setupStart"
          icon="️⇤"
          disabled={!controlSelected}
          active={!!(controlMode && controlModeStep === 0)}
          label=""
          onClick={() => {
            if (controlSelected) {
              setControlmode({ control: controlSelected.name, step: 0 });
              updateImageDefinition((state) => ({
                ...state,
                controlValues: {
                  ...state.controlValues,
                  [controlSelected.name]: 0,
                },
              }));
            }
          }}
        />,
        ...(controlSelected && controlSelected.steps.length > 2
          ? new Array(controlSelected.steps.length - 2)
              .fill(null)
              .map((_e, i) => (
                <ToolbarButton
                  key={`setupStep${i + 1}`}
                  icon={`${i + 1}`}
                  disabled={!controlSelected}
                  active={
                    !!(
                      controlMode &&
                      controlSelected &&
                      controlModeStep === i + 1
                    )
                  }
                  label=""
                  onClick={() => {
                    if (controlSelected) {
                      const step = i + 1;
                      setControlmode({
                        control: controlSelected.name,
                        step: step,
                      });
                      updateImageDefinition((state) => ({
                        ...state,
                        controlValues: {
                          ...state.controlValues,
                          [controlSelected.name]: step,
                        },
                      }));
                    }
                  }}
                />
              ))
          : []),
        <ToolbarButton
          key="setupEnd"
          icon="️⇥"
          disabled={!controlSelected}
          active={
            !!(
              controlMode &&
              controlSelected &&
              controlModeStep === controlSelected.steps.length - 1
            )
          }
          label=""
          onClick={() => {
            if (controlSelected) {
              const lastStep = controlSelected.steps.length - 1;
              setControlmode({ control: controlSelected.name, step: lastStep });
              updateImageDefinition((state) => ({
                ...state,
                controlValues: {
                  ...state.controlValues,
                  [controlSelected.name]: lastStep,
                },
              }));
            }
          }}
        />,
      ]}
      menus={[
        <Menu
          title="Composition"
          key="layers"
          collapsable={true}
          size={"large"}
          toolbarItems={[
            <ToolbarButton
              key="1"
              hint="Add mutator"
              icon="⚪️"
              label="+"
              size="small"
              disabled={shapeSelected === null && vectorSelected === null}
              onClick={async () => {
                if (shapeSelected === null && vectorSelected === null) {
                  return;
                }

                const newVector = await addVector(
                  updateImageDefinition,
                  (shapeSelected || vectorSelected) as
                    | ShapeDefinition
                    | MutationVector,
                  "New Mutator"
                );
                setItemSelected(newVector);
              }}
            />,
            <ToolbarButton
              key="2"
              hint="Add folder"
              icon="📁"
              label="+"
              size="small"
              onClick={async () => {
                const newFolder = await addFolder(
                  updateImageDefinition,
                  "New Folder",
                  shapeSelected?.name
                );
                setItemSelected(newFolder);
              }}
            />,
            <ToolbarButton
              key="remove"
              hint="Remove item"
              icon="🗑"
              size="small"
              disabled={
                !!(shapeSelected && shapeSelected.type === "sprite") ||
                !!(layerSelected && layerSelected.type === "control") ||
                !canDelete(layerSelected, imageDefinition)
              }
              label=""
              onClick={() => {
                if (layerSelected === null) {
                  return;
                }
                setItemSelected(null);
                updateImageDefinition((state) =>
                  removeItem(state, layerSelected)
                );
              }}
            />,
            <ToolbarButton
              key="3"
              hint="Move item up"
              icon="⬆"
              disabled={
                !!(layerSelected && layerSelected.type === "control") ||
                !canMoveUp(layerSelected, imageDefinition)
              }
              label=""
              size="small"
              onClick={() => {
                if (layerSelected === null) {
                  return;
                }
                updateImageDefinition((state) => moveUp(state, layerSelected));
              }}
            />,
            <ToolbarButton
              key="4"
              hint="Move item down"
              icon="⬇"
              disabled={
                !!(layerSelected && layerSelected.type === "control") ||
                !canMoveDown(layerSelected, imageDefinition)
              }
              label=""
              size="small"
              onClick={() => {
                if (layerSelected === null) {
                  return;
                }
                updateImageDefinition((state) =>
                  moveDown(state, layerSelected)
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
              showSetMutationVectors={
                controlMode
                  ? getSetVectorNames(imageDefinition, controlMode)
                  : []
              }
              onRename={(oldName, newName, item) => {
                if (item.type === "folder" || item.type === "sprite") {
                  const layerName = makeLayerName(
                    imageDefinition,
                    newName,
                    layerSelected ? layerSelected.name : null
                  );
                  updateImageDefinition((state) =>
                    renameLayer(state, oldName, layerName)
                  );
                  setLayerSelected({
                    name: layerName,
                    type: "layer",
                  });
                } else {
                  const vectorName = makeVectorName(
                    imageDefinition,
                    newName,
                    layerSelected ? layerSelected.name : null
                  );
                  updateImageDefinition((state) =>
                    renameVector(state, oldName, vectorName)
                  );
                  setLayerSelected({
                    name: vectorName,
                    type: "vector",
                  });
                }
              }}
            />
          }
        />,
        <Menu
          title="Controls"
          key="controls"
          collapsable={true}
          size="minimal"
          toolbarItems={[
            <ToolbarButton
              key="1"
              icon="️⚙️"
              label="+"
              size="small"
              onClick={async () => {
                const newControl = await addControl(
                  updateImageDefinition,
                  "New Control"
                );
                setItemSelected(newControl);
              }}
            />,
            <ToolbarButton
              key="remove"
              hint="Remove item"
              icon="🗑"
              size="small"
              disabled={!(layerSelected && layerSelected.type === "control")}
              label=""
              onClick={() => {
                if (layerSelected === null) {
                  return;
                }
                setItemSelected(null);
                updateImageDefinition((state) =>
                  removeItem(state, layerSelected)
                );
              }}
            />,
            <ToolbarButton
              key="3"
              hint="Move item up"
              icon="⬆"
              disabled={
                !!(layerSelected && layerSelected.type !== "control") ||
                !canMoveUp(layerSelected, imageDefinition)
              }
              label=""
              size="small"
              onClick={() => {
                if (layerSelected === null) {
                  return;
                }
                updateImageDefinition((state) => moveUp(state, layerSelected));
              }}
            />,
            <ToolbarButton
              key="4"
              hint="Move item down"
              icon="⬇"
              disabled={
                !!(layerSelected && layerSelected.type !== "control") ||
                !canMoveDown(layerSelected, imageDefinition)
              }
              label=""
              size="small"
              onClick={() => {
                if (layerSelected === null) {
                  return;
                }
                updateImageDefinition((state) =>
                  moveDown(state, layerSelected)
                );
              }}
            />,
          ]}
          items={imageDefinition.controls.map((e) => (
            <MenuItem
              key={e.name}
              icon="⚙️"
              label={e.name}
              selected={
                !!(
                  (layerSelected &&
                    layerSelected.type === "control" &&
                    layerSelected.name === e.name) ||
                  (controlMode && controlMode.control === e.name)
                )
              }
              onClick={() => {
                setControlmode((previousMode) =>
                  previousMode === null
                    ? null
                    : { ...previousMode, control: e.name }
                );
                setItemSelected(e);
              }}
              allowRename={true}
              onRename={(newName) => {
                const controlName = makeControlName(
                  imageDefinition,
                  newName,
                  layerSelected ? layerSelected.name : null
                );
                updateImageDefinition((state) =>
                  renameControl(state, e.name, controlName)
                );
                setLayerSelected({
                  name: controlName,
                  type: "control",
                });
              }}
            />
          ))}
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
            image={imageDefinition}
            updateImageDefinition={updateImageDefinition}
            activeControl={controlMode ? controlMode.control : undefined}
            controlPosition={controlMode ? controlModeStep : undefined}
            vectorValue={
              (activeControlValues
                ? activeControlValues[vectorSelected.name]
                : imageDefinition &&
                  imageDefinition.defaultFrame[vectorSelected.name]) ||
              defaultValueForVector(vectorSelected.type)
            }
            updateVectorValue={(newValue) => {
              if (controlMode) {
                updateImageDefinition((state) =>
                  visit(state, (item) => {
                    if (
                      isControlDefinition(item) &&
                      item.name === controlMode.control
                    ) {
                      return {
                        ...item,
                        steps: item.steps.map((step, index) =>
                          index === controlModeStep
                            ? { ...step, [vectorSelected.name]: newValue }
                            : step
                        ),
                      };
                    }
                    return undefined;
                  })
                );
              } else {
                updateImageDefinition((state) => ({
                  ...state,
                  defaultFrame: {
                    ...state.defaultFrame,
                    [vectorSelected.name]: newValue,
                  },
                }));
              }
            }}
          />
        ) : controlSelected ? (
          <ControlInfoPanel
            key="info"
            controlSelected={controlSelected}
            value={imageDefinition.controlValues[controlSelected.name] || 0}
            updateImageDefinition={updateImageDefinition}
            onChange={(newValue) => {
              updateImageDefinition((state) => ({
                ...state,
                controlValues: {
                  ...state.controlValues,
                  [controlSelected.name]: newValue,
                },
              }));
            }}
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
            vectorValues={vectorValues}
            zoom={zoom}
            panX={panX}
            panY={panY}
            activeLayer={layerSelected}
            showFPS={showFPS}
          />
        </MouseControl>
      }
    />
  );
};

export default Composition;
