import React, { useCallback, useMemo, useState } from "react";

import { InstallToolButton } from "@/application/modules/application-menu/ui/InstallToolButton";
import { StartupScreen } from "@/application/modules/application-menu/ui/Startup";
import TextureMapCanvas, {
  type GridSettings,
} from "@/application/modules/layers/ui/TextureMapCanvas";
import { useFile } from "@/application/state/FileContext";
import { useActionMap } from "@/application/state/hooks/useActionMap";
import { useEvent } from "@/application/state/hooks/useEvent";
import { useScreenTranslation } from "@/application/state/ScreenTranslationContext";
import { ActionToolButton } from "@/application/ui/ActionToolButton";
import LayerMouseControl from "@/application/ui/LayerMouseControl";
import { MouseMode } from "@/application/ui/MouseControl";
import { SectionSelector } from "@/application/ui/SectionSelector";
import {
  addPoint,
  deletePoint,
  movePoint,
} from "@/domain/animation/file2/shapes";
import { type Layer } from "@/dtos/animation-file2.dto";
import { type AppSection } from "@/dtos/application.dto";
import {
  getInitialScale,
  maxZoomFactor,
  mouseToTextureCoordinate,
} from "@/infrastructure/webgl/lib/canvas";
import { type Vec2 } from "@/shared/types/global";
import {
  Column,
  Icon,
  Menu,
  MenuHeader,
  MenuItem,
  MenuRadioGroup,
  Panel,
  ResizeDirection,
  ResizePanel,
  Row,
  type Shortcut,
  ToolBar,
  ToolButton,
  ToolSeparator,
  ToolSpacer,
} from "@/ui/components";

import { type IDLayer } from "./programs/showLayerPoints";
import { ShapeTree } from "./ui/ShapeTree";

type LayersModuleProps = {
  onSectionChange?: (newSection: AppSection) => void;
  texture: HTMLImageElement | null;
  menu?: React.ReactNode;
};

const snapToGrid = (gridSize: number, value: number) =>
  Math.round(value / gridSize) * gridSize;

const snapToGridDown = (gridSize: number, value: number) =>
  Math.floor(value / gridSize) * gridSize;

const snapToGridUp = (gridSize: number, value: number) =>
  Math.ceil(value / gridSize) * gridSize;

const alignOnGrid = (gridSettings: GridSettings, coord: Vec2): Vec2 =>
  gridSettings.magnetic
    ? [
        snapToGrid(gridSettings.size, coord[0]),
        snapToGrid(gridSettings.size, coord[1]),
      ]
    : coord;

const DELETE_POINT: Shortcut = { interaction: "DelOrBackspace" };

export const LayersModule: React.FC<LayersModuleProps> = ({
  texture,
  onSectionChange,
  menu,
}) => {
  const translation = useScreenTranslation();

  const [mouseMode, setMouseMode] = useState(MouseMode.Normal);
  const [gridSettings, setGridSettings] = useState<GridSettings>({
    enabled: false,
    magnetic: false,
    size: 32,
  });

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [activeCoord, setActiveCoord] = useState<Vec2 | null>(null);
  const [file, setFile] = useFile();

  const layers = file.layers;
  const maxZoom = maxZoomFactor(texture);
  const idLayers: IDLayer[] = useMemo(
    () => Object.entries(layers).map(([id, layer]) => ({ id, ...layer })),
    [layers]
  );

  const activeLayer = selectedItems.length === 1 ? selectedItems[0] : undefined;
  if (!activeLayer && activeCoord) {
    setActiveCoord(null);
  }

  const getClosestPoint = useEvent(
    (element: HTMLElement, coord: Vec2, shape: Layer): Vec2 | undefined => {
      if (!texture) return undefined;
      const canvasPos = element.getBoundingClientRect();
      const initialScale = getInitialScale(
        [canvasPos.width, canvasPos.height],
        [texture.width, texture.height]
      );
      const factor = initialScale * translation.zoom;
      const closePoint = shape.points.find((p) => {
        const dx = p[0] - coord[0];
        const dy = p[1] - coord[1];

        return dx > -factor && dx < factor && dy > -factor && dy < factor;
      });
      return closePoint;
    }
  );

  const mouseClick = useEvent((event: React.MouseEvent<HTMLElement>) => {
    if (
      (mouseMode === MouseMode.Aim || mouseMode === MouseMode.Normal) &&
      texture &&
      activeLayer
    ) {
      const { zoom, panX, panY } = translation;
      const coord = mouseToTextureCoordinate(
        texture,
        zoom,
        [panX, panY],
        event
      );

      const shape = file.layers[activeLayer];
      if (shape) {
        const closePoint = getClosestPoint(event.currentTarget, coord, shape);

        if (!closePoint && mouseMode === MouseMode.Aim) {
          const gridCoord = alignOnGrid(gridSettings, coord);
          setFile((image) => addPoint(image, activeLayer, gridCoord));
          setActiveCoord(gridCoord);
        } else if (closePoint) {
          setActiveCoord(closePoint);
        }
      }
    }
  });

  const hoverCursor = useEvent(
    (event: React.MouseEvent<HTMLElement>): MouseMode => {
      if (
        (mouseMode === MouseMode.Aim || mouseMode === MouseMode.Normal) &&
        texture &&
        activeLayer
      ) {
        const { zoom, panX, panY } = translation;
        const coord = mouseToTextureCoordinate(
          texture,
          zoom,
          [panX, panY],
          event
        );
        const shape = file.layers[activeLayer];
        if (shape) {
          const closePoint = getClosestPoint(event.currentTarget, coord, shape);
          if (closePoint) {
            return MouseMode.Target;
          }
        }
      }
      return mouseMode;
    }
  );

  const { actions, triggerKeyboardAction } = useActionMap(
    useCallback(
      () => ({
        deleteActivePoint: {
          icon: "🗑",
          tooltip: "Remove selected point",
          shortcut: DELETE_POINT,
          handler: () => {
            if (!activeCoord || !activeLayer) return;
            setFile((image) => deletePoint(image, activeLayer, activeCoord));
            setActiveCoord(null);
          },
        },
      }),
      [activeCoord, setFile, setActiveCoord, activeLayer]
    )
  );

  const keyboardControl = useEvent((e: React.KeyboardEvent<HTMLElement>) => {
    if (triggerKeyboardAction(e)) {
      e.preventDefault();
    }
    if (activeLayer && activeCoord) {
      const newValue: Vec2 = [activeCoord[0], activeCoord[1]];
      if (e.shiftKey) {
        if (e.code === "ArrowLeft" || e.code === "ArrowUp") {
          const index = e.code === "ArrowLeft" ? 0 : 1;
          newValue[index] = snapToGridDown(gridSettings.size, newValue[index]);
          if (newValue[index] === activeCoord[index]) {
            newValue[index] -= gridSettings.size;
          }
        }
        if (e.code === "ArrowRight" || e.code === "ArrowDown") {
          const index = e.code === "ArrowRight" ? 0 : 1;
          newValue[index] = snapToGridUp(gridSettings.size, newValue[index]);
          if (newValue[index] === activeCoord[index]) {
            newValue[index] += gridSettings.size;
          }
        }
      } else {
        if (e.code === "ArrowLeft") {
          newValue[0] -= 1;
        }
        if (e.code === "ArrowRight") {
          newValue[0] += 1;
        }
        if (e.code === "ArrowDown") {
          newValue[1] += 1;
        }
        if (e.code === "ArrowUp") {
          newValue[1] -= 1;
        }
      }
      if (newValue[0] !== activeCoord[0] || newValue[1] !== activeCoord[1]) {
        setFile((image) =>
          movePoint(image, activeLayer, activeCoord, newValue)
        );
        setActiveCoord(newValue);
      }
    }
  });

  return (
    <Column>
      <ToolBar>
        {menu}
        <ToolSeparator />
        <SectionSelector
          activeSection="layers"
          onSectionChange={onSectionChange}
        />
        <ToolSeparator />
        <ToolButton
          active={mouseMode === MouseMode.Normal}
          disabled={activeLayer === undefined}
          icon={<Icon>🔧</Icon>}
          onClick={useCallback(() => {
            setMouseMode(MouseMode.Normal);
          }, [setMouseMode])}
          tooltip="Adjust point mode"
        />
        <ToolButton
          active={mouseMode === MouseMode.Aim}
          disabled={activeLayer === undefined}
          icon={<Icon>✏️</Icon>}
          onClick={useCallback(() => {
            setMouseMode(MouseMode.Aim);
          }, [setMouseMode])}
          tooltip="Add point mode"
        />
        <ToolSeparator />
        <ActionToolButton
          action={actions.deleteActivePoint}
          disabled={activeCoord === null}
        />
        <ToolSeparator />
        <ToolButton
          active={gridSettings.enabled}
          icon={<Icon>📏</Icon>}
          onClick={useCallback(() => {
            setGridSettings((settings) => ({
              ...settings,
              enabled: !settings.enabled,
            }));
          }, [])}
          tooltip="Toggle grid visibility"
        />
        <Menu
          align="center"
          arrow
          direction="bottom"
          menuButton={({ open }) => (
            <ToolButton active={open} label={`${gridSettings.size}`} />
          )}
          portal
          transition
        >
          <MenuHeader>Grid size</MenuHeader>
          <MenuRadioGroup value={gridSettings.size}>
            {[8, 16, 32, 64, 128].map((size) => (
              <MenuItem
                key={`grid${size}`}
                onClick={() => {
                  setGridSettings((settings) => ({
                    ...settings,
                    size,
                    enabled: true,
                  }));
                }}
                type="radio"
                value={size}
              >
                {size}
              </MenuItem>
            ))}
          </MenuRadioGroup>
        </Menu>
        <ToolButton
          active={gridSettings.magnetic}
          icon={<Icon>🧲</Icon>}
          onClick={useCallback(() => {
            setGridSettings((settings) => ({
              ...settings,
              magnetic: !settings.magnetic,
            }));
          }, [])}
          tooltip="Toggle magnetic grid"
        />
        <ToolSpacer />
        <InstallToolButton />
      </ToolBar>
      <Row>
        <ResizePanel
          defaultSize={250}
          direction={ResizeDirection.East}
          minSize={150}
        >
          <Column>
            <ShapeTree selectedItemsState={[selectedItems, setSelectedItems]} />
          </Column>
        </ResizePanel>
        <Panel center workspace>
          {texture === null ? (
            <StartupScreen file={file} texture={texture} />
          ) : (
            <LayerMouseControl
              hoverCursor={hoverCursor}
              maxZoomFactor={maxZoom}
              mode={mouseMode}
              onClick={mouseClick}
              onKeyDown={keyboardControl}
            >
              <TextureMapCanvas
                activeCoord={activeCoord}
                activeLayer={activeLayer}
                grid={gridSettings}
                image={texture}
                layers={idLayers}
              />
            </LayerMouseControl>
          )}
        </Panel>
      </Row>
    </Column>
  );
};
