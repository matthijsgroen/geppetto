import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import LayerMouseControl from "../components/LayerMouseControl";
import {
  defaultStepFn,
  StepSize,
  UpDown,
} from "../components/NumberInputControl";
import Vec2InputControl from "../components/Vec2InputControl";
import TextureMapCanvas, {
  GridSettings,
  GRID_SIZES,
} from "../animation/TextureMapCanvas";
import Menu from "../components/Menu";
import { MouseMode } from "../components/MouseControl";
import ToolbarButton from "../components/ToolbarButton";
import ToolbarSeperator from "../components/ToolbarSeperator";
import {
  addPoint,
  getLayerNames,
  getShape,
  removePoint,
  updatePoint,
} from "../lib/definitionHelpers";
import { Vec2 } from "../../types";
import { ImageDefinition, ItemSelection } from "../../animation/file1/types";
import { getTextureCoordinate, maxZoomFactor } from "../lib/webgl";
import ScreenLayout from "../templates/ScreenLayout";
import LayersMenu from "./layers/LayersMenu";

interface LayersProps {
  imageDefinition: ImageDefinition;
  texture: HTMLImageElement | null;
  updateImageDefinition: Dispatch<SetStateAction<ImageDefinition>>;
  showFPS?: boolean;
}

const snapToGrid = (gridSize: number, value: number) =>
  Math.round(value / gridSize) * gridSize;

const alignOnGrid = (gridSettings: GridSettings, coord: Vec2): Vec2 =>
  gridSettings.magnetic
    ? [
        snapToGrid(GRID_SIZES[gridSettings.size], coord[0]),
        snapToGrid(GRID_SIZES[gridSettings.size], coord[1]),
      ]
    : coord;

const Layers: React.FC<LayersProps> = ({
  texture,
  imageDefinition,
  updateImageDefinition,
  showFPS,
}) => {
  const zoomState = useState(1.0);
  const panXState = useState(0.0);
  const panYState = useState(0.0);
  const [zoom] = zoomState;
  const [panX] = panXState;
  const [panY] = panYState;
  const [gridSettings, setGridSettings] = useState<GridSettings>({
    enabled: false,
    magnetic: false,
    size: 2,
  });
  const [activeCoord, setActiveCoord] = useState<null | [number, number]>(null);
  const [layerSelected, setLayerSelected] =
    useState<null | ItemSelection>(null);
  const [mouseMode, setMouseMode] = useState(MouseMode.Grab);

  useEffect(() => {
    if (layerSelected === null || layerSelected.type === "folder") {
      setMouseMode(MouseMode.Grab);
      setActiveCoord(null);
    }
  }, [layerSelected]);

  useEffect(() => {
    if (!layerSelected) {
      return;
    }
    const names = getLayerNames(imageDefinition.shapes);
    if (!names.includes(layerSelected.name)) {
      setLayerSelected(null);
    }
  }, [imageDefinition]);

  const mouseClick = useCallback(
    (event: React.MouseEvent) => {
      if (
        (mouseMode === MouseMode.Aim || mouseMode === MouseMode.Normal) &&
        texture &&
        layerSelected
      ) {
        const canvasPos = event.currentTarget.getBoundingClientRect();
        const elementX = event.pageX - canvasPos.left;
        const elementY = event.pageY - canvasPos.top;
        const coord = getTextureCoordinate(
          [canvasPos.width, canvasPos.height],
          [texture.width, texture.height],
          [panX, panY],
          zoom,
          [elementX, elementY]
        );

        const shape = getShape(imageDefinition, layerSelected.name);
        if (shape && shape.type === "sprite") {
          const closePoint = shape.points.find((p) => {
            const dx = p[0] - coord[0];
            const dy = p[1] - coord[1];
            const zf = maxZoomFactor(texture);

            return (
              dx > -zf / zoom &&
              dx < zf / zoom &&
              dy > -zf / zoom &&
              dy < zf / zoom
            );
          });

          if (!closePoint && mouseMode === MouseMode.Aim) {
            const gridCoord = alignOnGrid(gridSettings, coord);
            updateImageDefinition((state) =>
              addPoint(state, layerSelected.name, gridCoord)
            );
            setActiveCoord(gridCoord);
          } else {
            closePoint && setActiveCoord(closePoint);
          }
        }
      }
    },
    [
      layerSelected,
      mouseMode,
      panX,
      panY,
      setActiveCoord,
      texture,
      updateImageDefinition,
      zoom,
      imageDefinition,
      gridSettings,
    ]
  );

  return (
    <ScreenLayout
      menus={[
        <LayersMenu
          imageDefinition={imageDefinition}
          updateImageDefinition={updateImageDefinition}
          layerSelected={layerSelected}
          setLayerSelected={setLayerSelected}
        />,
        <Menu
          title={"Point Info"}
          key="pointInfo"
          collapsable={true}
          size="minimal"
          items={
            activeCoord
              ? [
                  <Vec2InputControl
                    key={"editPoint"}
                    title={"Point"}
                    value={activeCoord}
                    onChange={(newValue) => {
                      if (layerSelected) {
                        updateImageDefinition((state) =>
                          updatePoint(
                            state,
                            layerSelected.name,
                            activeCoord,
                            newValue
                          )
                        );
                        setActiveCoord(newValue);
                      }
                    }}
                    onStep={(value, upDown, step) => {
                      const gSize = GRID_SIZES[gridSettings.size];
                      if (step === StepSize.MEDIUM) {
                        if (value % gSize === 0) {
                          return upDown === UpDown.UP
                            ? value + gSize
                            : value - gSize;
                        } else {
                          return upDown === UpDown.UP
                            ? Math.ceil(value / gSize) * gSize
                            : Math.floor(value / gSize) * gSize;
                        }
                      }
                      return defaultStepFn(value, upDown, step);
                    }}
                  />,
                ]
              : []
          }
        />,
      ]}
      tools={[
        <ToolbarButton
          key="move"
          hint="Move mode"
          icon="✋"
          active={mouseMode === MouseMode.Grab}
          label=""
          onClick={() => {
            setMouseMode(MouseMode.Grab);
          }}
        />,
        <ToolbarButton
          key="selectPoints"
          hint="Select point mode"
          icon="️🔧"
          disabled={!layerSelected || layerSelected.type === "folder"}
          active={mouseMode === MouseMode.Normal}
          label=""
          onClick={() => {
            setMouseMode(MouseMode.Normal);
          }}
        />,
        <ToolbarButton
          key="addPoints"
          hint="Add points mode"
          icon="✏️"
          disabled={!layerSelected || layerSelected.type === "folder"}
          active={mouseMode === MouseMode.Aim}
          label=""
          onClick={() => {
            setMouseMode(MouseMode.Aim);
          }}
        />,
        <ToolbarSeperator key="sep1" />,
        <ToolbarButton
          key="delete"
          hint="Remove selected point"
          icon="🗑"
          label=""
          disabled={!activeCoord}
          onClick={async () => {
            if (activeCoord === null || layerSelected === null) {
              return;
            }
            updateImageDefinition((state) =>
              removePoint(state, layerSelected.name, activeCoord)
            );
            setActiveCoord(null);
          }}
        />,
        <ToolbarSeperator key="sep2" />,
        <ToolbarButton
          key="decreaseGrid"
          hint="Decrease grid size"
          icon=""
          label="-"
          disabled={!texture || gridSettings.size <= 0}
          onClick={() => {
            setGridSettings((settings) => ({
              ...settings,
              size: Math.max(settings.size - 1, 0),
            }));
          }}
        />,
        <ToolbarButton
          key="toggleGrid"
          hint="Toggle sticky grid"
          icon="📏"
          label={`${GRID_SIZES[gridSettings.size]}`}
          disabled={!texture}
          active={gridSettings.enabled}
          onClick={() => {
            setGridSettings((settings) => ({
              ...settings,
              enabled: !settings.enabled,
            }));
          }}
        />,
        <ToolbarButton
          key="increaseGrid"
          hint="Increase grid size"
          icon=""
          label="+"
          disabled={!texture || gridSettings.size >= GRID_SIZES.length - 1}
          onClick={() => {
            setGridSettings((settings) => ({
              ...settings,
              size: Math.min(settings.size + 1, GRID_SIZES.length),
            }));
          }}
        />,
        <ToolbarButton
          key="magneticGrid"
          hint="Toggle magnetic grid"
          icon="🧲"
          label=""
          disabled={!texture}
          active={gridSettings.magnetic}
          onClick={() => {
            setGridSettings((settings) => ({
              ...settings,
              magnetic: !settings.magnetic,
            }));
          }}
        />,
      ]}
      main={
        <LayerMouseControl
          mode={mouseMode}
          texture={texture}
          panXState={panXState}
          panYState={panYState}
          zoomState={zoomState}
          onClick={mouseClick}
        >
          <TextureMapCanvas
            image={texture}
            shapes={imageDefinition.shapes}
            zoom={zoom}
            panX={panX}
            panY={panY}
            grid={gridSettings}
            activeLayer={layerSelected}
            activeCoord={activeCoord}
            showFPS={showFPS}
          />
        </LayerMouseControl>
      }
    />
  );
};

export default Layers;
