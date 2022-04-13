import React, { useCallback, useState } from "react";
import { GeppettoImage } from "src/animation/file2/types";
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
} from "src/ui-components";
import { UseState } from "../types";
import LayerMouseControl from "../canvas/LayerMouseControl";
import { MouseMode } from "../canvas/MouseControl";
import TextureMapCanvas, { GridSettings } from "../webgl/TextureMapCanvas";
import { ShapeTree } from "./ShapeTree";
import { maxZoomFactor } from "../webgl/lib/webgl";
import { InstallToolButton } from "../applicationMenu/InstallToolButton";

type LayersProps = {
  zoomState: UseState<number>;
  panXState: UseState<number>;
  panYState: UseState<number>;
  fileState: UseState<GeppettoImage>;
  textureState: UseState<HTMLImageElement | null>;
  menu?: React.ReactChild;
};

export const Layers: React.VFC<LayersProps> = ({
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
  const [mouseMode /*setMouseMode*/] = useState(MouseMode.Grab);
  const [gridSettings, setGridSettings] = useState<GridSettings>({
    enabled: false,
    magnetic: false,
    size: 32,
  });
  const maxZoom = maxZoomFactor(textureState[0]);

  return (
    <Column>
      <ToolBar>
        {menu}
        <ToolTab icon={<Icon>🧬</Icon>} label={"Layers"} active />
        <ToolTab icon={<Icon>🤷🏼</Icon>} label={"Composition"} disabled />
        <ToolTab icon={<Icon>🏃</Icon>} label={"Animation"} disabled />
        <ToolSeparator />
        <ToolButton active icon={<Icon>✋</Icon>} tooltip="Move mode" />
        <ToolButton
          icon={<Icon>🔧</Icon>}
          tooltip="Adjust point mode"
          disabled
        />
        <ToolButton icon={<Icon>✏️</Icon>} tooltip="Add point mode" disabled />
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
                onClick={useCallback(() => {
                  setGridSettings((settings) => ({
                    ...settings,
                    size,
                    enabled: true,
                  }));
                }, [])}
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
            <ShapeTree fileState={fileState} />
          </Column>
        </ResizePanel>
        <Panel workspace center>
          {textureState[0] === null ? (
            <p>No texture loaded</p>
          ) : (
            <LayerMouseControl
              mode={mouseMode}
              maxZoomFactor={maxZoom}
              panXState={panXState}
              panYState={panYState}
              zoomState={zoomState}
              // onClick={mouseClick}
            >
              <TextureMapCanvas
                image={textureState[0]}
                shapes={[]}
                zoom={zoom}
                panX={panX}
                panY={panY}
                grid={gridSettings}
                activeLayer={null}
                activeCoord={null}
                showFPS={false}
              />
            </LayerMouseControl>
          )}
        </Panel>
      </Row>
    </Column>
  );
};
