import { useEffect, useMemo } from "react";
import { GeppettoImage } from "src/animation/file2/types";
import {
  Column,
  Icon,
  Menu,
  MenuItem,
  MenuRadioGroup,
  Panel,
  ResizeDirection,
  ResizePanel,
  Row,
  ToolBar,
  ToolButton,
  ToolSeparator,
  ToolTab,
  Tree,
} from "src/ui-components";
import { UseState } from "../types";
import { treeDataProvider } from "./TreeDataProvider";

type LayersProps = {
  zoomState: UseState<number>;
  panXState: UseState<number>;
  panYState: UseState<number>;
  fileState: UseState<GeppettoImage>;
  menu?: React.ReactChild;
};

export const Layers: React.VFC<LayersProps> = ({ fileState, menu }) => {
  const [fileData] = fileState;

  const treeData = useMemo(
    () => treeDataProvider(fileData, { showMutations: false }),
    []
  );
  useEffect(() => {
    treeData.updateActiveTree && treeData.updateActiveTree(fileData);
  }, [fileData]);

  return (
    <Column>
      <ToolBar>
        {menu}
        <ToolTab icon={<Icon>🧬</Icon>} label={"Layers"} active />
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
        <ToolButton icon={<Icon>🧲</Icon>} tooltip="Toggle magnetic grid" />
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
            <ToolBar size="small">
              <ToolButton
                icon={<Icon>📄</Icon>}
                label="+"
                tooltip="Add layer"
              />
              <ToolButton
                icon={<Icon>📁</Icon>}
                label="+"
                tooltip="Add folder"
              />
              <ToolButton
                icon={<Icon>📑</Icon>}
                disabled={true}
                tooltip="Copy layer"
              />
              <ToolButton
                icon={<Icon>🗑</Icon>}
                disabled={true}
                tooltip="Remove item"
              />
              <ToolButton
                icon={<Icon>⬆</Icon>}
                disabled={true}
                tooltip="Move item up"
              />
              <ToolButton
                icon={<Icon>⬇</Icon>}
                disabled={true}
                tooltip="Move item down"
              />
            </ToolBar>
            <Panel padding={5}>{<Tree dataProvider={treeData} />}</Panel>
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
