import React, { useCallback, useMemo, useRef, useState } from "react";
import { GeppettoImage } from "../../animation/file2/types";
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
  ToolBar,
  ToolButton,
  ToolSeparator,
  ToolSpacer,
  ToolTab,
} from "../../ui-components";
import { UseState } from "../types";
import LayerMouseControl from "../canvas/LayerMouseControl";
import { MouseMode } from "../canvas/MouseControl";
import TextureMapCanvas, { GridSettings } from "../webgl/TextureMapCanvas";
import { ShapeTree } from "./ShapeTree";
import { maxZoomFactor, mouseToTextureCoordinate } from "../webgl/lib/webgl";
import { InstallToolButton } from "../applicationMenu/InstallToolButton";
import { IDLayer } from "../webgl/programs/showLayerPoints";
import { Vec2 } from "../../types";

type LayersProps = {
  zoomState: UseState<number>;
  panXState: UseState<number>;
  panYState: UseState<number>;
  fileState: UseState<GeppettoImage>;
  textureState: UseState<HTMLImageElement | null>;
  menu?: React.ReactChild;
};

const snapToGrid = (gridSize: number, value: number) =>
  Math.round(value / gridSize) * gridSize;

const alignOnGrid = (gridSettings: GridSettings, coord: Vec2): Vec2 =>
  gridSettings.magnetic
    ? [
        snapToGrid(gridSettings.size, coord[0]),
        snapToGrid(gridSettings.size, coord[1]),
      ]
    : coord;

export const Layers: React.FC<LayersProps> = ({
  fileState,
  textureState,
  menu,
}) => {
  const zoomState = useState(1.0);
  const panXState = useState(0.0);
  const panYState = useState(0.0);
  const [zoom] = zoomState;
  const [panX] = panXState;
  const [panY] = panYState;
  const zoomPanRef = useRef({ zoom, panX, panY });
  zoomPanRef.current = { zoom, panX, panY };

  const [mouseMode, setMouseMode] = useState(MouseMode.Grab);
  const [gridSettings, setGridSettings] = useState<GridSettings>({
    enabled: false,
    magnetic: false,
    size: 32,
  });

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [activeCoord, setActiveCoord] = useState<Vec2 | null>(null);
  const texture = textureState[0];
  const file = fileState[0];

  const layers = file.layers;
  const maxZoom = maxZoomFactor(texture);
  const idLayers: IDLayer[] = useMemo(
    () => Object.entries(layers).map(([id, layer]) => ({ id, ...layer })),
    [layers]
  );

  const activeLayer = selectedItems.length === 1 ? selectedItems[0] : undefined;

  const mouseClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (
        (mouseMode === MouseMode.Aim || mouseMode === MouseMode.Normal) &&
        texture &&
        activeLayer
      ) {
        const { zoom, panX, panY } = zoomPanRef.current;
        const coord = mouseToTextureCoordinate(
          texture,
          zoom,
          [panX, panY],
          event
        );
        console.log(coord);

        const shape = file.layers[activeLayer];
        if (shape) {
          const factor = maxZoom / zoom;
          const closePoint = shape.points.find((p) => {
            const dx = p[0] - coord[0];
            const dy = p[1] - coord[1];

            return dx > -factor && dx < factor && dy > -factor && dy < factor;
          });

          if (!closePoint && mouseMode === MouseMode.Aim) {
            const gridCoord = alignOnGrid(gridSettings, coord);
            // updateImageDefinition((state) =>
            //   addPoint(state, layerSelected.name, gridCoord)
            // );
            setActiveCoord(gridCoord);
          } else {
            closePoint && setActiveCoord(closePoint);
          }
        }
      }
    },
    [
      activeLayer,
      mouseMode,
      zoomPanRef,
      setActiveCoord,
      texture,
      file.layers,
      maxZoom,
      // updateImageDefinition,
      // imageDefinition,
      gridSettings,
    ]
  );

  const hoverCursor = useCallback(
    (event: React.MouseEvent<HTMLElement>): MouseMode => {
      if (
        (mouseMode === MouseMode.Aim || mouseMode === MouseMode.Normal) &&
        texture &&
        activeLayer
      ) {
        const { zoom, panX, panY } = zoomPanRef.current;
        const coord = mouseToTextureCoordinate(
          texture,
          zoom,
          [panX, panY],
          event
        );

        const shape = file.layers[activeLayer];
        if (shape) {
          const factor = maxZoom / zoom;
          const closePoint = shape.points.find((p) => {
            const dx = p[0] - coord[0];
            const dy = p[1] - coord[1];

            return dx > -factor && dx < factor && dy > -factor && dy < factor;
          });
          if (closePoint) {
            return MouseMode.Target;
          }
        }
      }
      return mouseMode;
    },
    [mouseMode, activeLayer, file.layers, maxZoom, zoomPanRef, texture]
  );

  return (
    <Column>
      <ToolBar>
        {menu}
        <ToolTab icon={<Icon>🧬</Icon>} label={"Layers"} active />
        <ToolTab icon={<Icon>🤷🏼</Icon>} label={"Composition"} disabled />
        <ToolTab icon={<Icon>🏃</Icon>} label={"Animation"} disabled />
        <ToolSeparator />
        <ToolButton
          active={mouseMode === MouseMode.Grab}
          icon={<Icon>✋</Icon>}
          tooltip="Move mode"
          onClick={useCallback(() => {
            setMouseMode(MouseMode.Grab);
          }, [setMouseMode])}
        />
        <ToolButton
          active={mouseMode === MouseMode.Normal}
          icon={<Icon>🔧</Icon>}
          tooltip="Adjust point mode"
          disabled={activeLayer === undefined}
          onClick={useCallback(() => {
            setMouseMode(MouseMode.Normal);
          }, [setMouseMode])}
        />
        <ToolButton
          active={mouseMode === MouseMode.Aim}
          icon={<Icon>✏️</Icon>}
          tooltip="Add point mode"
          disabled={activeLayer === undefined}
          onClick={useCallback(() => {
            setMouseMode(MouseMode.Aim);
          }, [setMouseMode])}
        />
        <ToolSeparator />
        <ToolButton
          icon={<Icon>🗑</Icon>}
          disabled
          tooltip="Remove selected point"
        />
        <ToolSeparator />
        <ToolButton
          icon={<Icon>📏</Icon>}
          tooltip="Toggle grid visibility"
          active={gridSettings.enabled}
          onClick={useCallback(() => {
            setGridSettings((settings) => ({
              ...settings,
              enabled: !settings.enabled,
            }));
          }, [])}
        />
        <Menu
          portal
          menuButton={({ open }) => (
            <ToolButton active={open} label={`${gridSettings.size}`} />
          )}
          direction="bottom"
          align="center"
          arrow
          transition
        >
          <MenuHeader>Grid size</MenuHeader>
          <MenuRadioGroup value={gridSettings.size}>
            {[8, 16, 32, 64, 128].map((size) => (
              <MenuItem
                type="radio"
                value={size}
                key={`grid${size}`}
                onClick={() => {
                  setGridSettings((settings) => ({
                    ...settings,
                    size,
                    enabled: true,
                  }));
                }}
              >
                {size}
              </MenuItem>
            ))}
          </MenuRadioGroup>
        </Menu>
        <ToolButton
          icon={<Icon>🧲</Icon>}
          tooltip="Toggle magnetic grid"
          active={gridSettings.magnetic}
          onClick={useCallback(() => {
            setGridSettings((settings) => ({
              ...settings,
              magnetic: !settings.magnetic,
            }));
          }, [])}
        />
        <ToolSpacer />
        <InstallToolButton />
      </ToolBar>
      <Row>
        <ResizePanel direction={ResizeDirection.East} defaultSize={250}>
          <Column>
            <ShapeTree
              fileState={fileState}
              selectedItemsState={[selectedItems, setSelectedItems]}
            />
          </Column>
        </ResizePanel>
        <Panel workspace center>
          {texture === null ? (
            <p>No texture loaded</p>
          ) : (
            <LayerMouseControl
              mode={mouseMode}
              maxZoomFactor={maxZoom}
              panXState={panXState}
              panYState={panYState}
              zoomState={zoomState}
              onClick={mouseClick}
              hoverCursor={hoverCursor}
            >
              <TextureMapCanvas
                image={texture}
                layers={idLayers}
                zoom={zoom}
                panX={panX}
                panY={panY}
                grid={gridSettings}
                activeLayer={activeLayer}
                activeCoord={activeCoord}
                showFPS={false}
              />
            </LayerMouseControl>
          )}
        </Panel>
      </Row>
    </Column>
  );
};
