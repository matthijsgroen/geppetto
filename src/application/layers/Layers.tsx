import React from "react";
import { GeppettoImage } from "src/animation/file2/types";
import {
  Column,
  ResizeDirection,
  ResizePanel,
  Row,
  ToolBar,
} from "src/ui-components";
import { UseState } from "../types";
import { ShapeTree } from "./ShapeTree";

type LayersProps = {
  zoomState: UseState<number>;
  panXState: UseState<number>;
  panYState: UseState<number>;
  fileState: UseState<GeppettoImage>;
  menu?: React.ReactChild;
};

export const Layers: React.VFC<LayersProps> = ({ fileState, menu }) => {
  return (
    <Column>
      <ToolBar>
        {menu}
        {/* <ToolTab icon={<Icon>🧬</Icon>} label={"Layers"} active />
        <ToolTab icon={<Icon>🤷🏼</Icon>} label={"Composition"} />
        <ToolTab icon={<Icon>🏃</Icon>} label={"Animation"} />
        <ToolSeparator />

        <ToolButton active icon={<Icon>✋</Icon>} tooltip="Move mode" />
        <ToolButton icon={<Icon>🔧</Icon>} tooltip="Adjust point mode" />
        <ToolButton icon={<Icon>✏️</Icon>} tooltip="Add point mode" />
        <ToolSeparator />
        <ToolButton
          icon={<Icon>🗑</Icon>}
          disabled
          tooltip="Remove selected point"
        />
        <ToolSeparator />
        <ToolButton icon={<Icon>📏</Icon>} tooltip="Toggle grid visibility" />
        <Menu
          portal
          menuButton={({ open }) => <ToolButton active={open} label="32" />}
          direction="bottom"
          align="center"
          arrow
          transition
        >
          <MenuRadioGroup value={32}>
            <MenuItem type="radio" value={8}>
              8
            </MenuItem>
            <MenuItem type="radio" value={16}>
              16
            </MenuItem>
            <MenuItem type="radio" value={32}>
              32
            </MenuItem>
            <MenuItem type="radio" value={64}>
              64
            </MenuItem>
            <MenuItem type="radio" value={128}>
              128
            </MenuItem>
          </MenuRadioGroup>
        </Menu>
        <ToolButton icon={<Icon>🧲</Icon>} tooltip="Toggle magnetic grid" /> */}
      </ToolBar>
      <Row>
        <ResizePanel direction={ResizeDirection.East} style={{ width: "20vw" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
            }}
          >
            <ShapeTree fileState={fileState} />
          </div>
        </ResizePanel>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexGrow: 2,
            background: "gray",
          }}
        >
          <p>Other content</p>
        </div>
      </Row>
    </Column>
  );
};
