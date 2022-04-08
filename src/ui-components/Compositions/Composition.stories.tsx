import { Story } from "@storybook/react";
import {
  ToolBar,
  Icon,
  ToolButton,
  ToolSeparator,
  ToolTab,
  ResizePanel,
  ResizeDirection,
  Tree,
  Panel,
  Menu,
  MenuItem,
  SubMenu,
  MenuHeader,
  MenuDivider,
  MenuRadioGroup,
} from "../";
import { storyTreeDataProvider } from "../Tree/Tree.stories";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Compositions/Layers",
  argTypes: {
    children: { control: false, table: false },
  },
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: Story = () => (
  <div>
    <ToolBar>
      <Menu
        portal={true}
        transition
        menuButton={({ open }) => (
          <ToolButton icon={<Icon>🍔</Icon>} active={open} />
        )}
      >
        <MenuItem>New</MenuItem>
        <MenuItem>Open</MenuItem>
        <MenuItem>Load texture</MenuItem>
        <MenuItem>Reload texture</MenuItem>
        <MenuItem disabled>Save</MenuItem>
        <MenuItem>Save as...</MenuItem>
        <MenuDivider />
        <MenuHeader>Edit</MenuHeader>
        <SubMenu label="Edit">
          <MenuItem>Cut</MenuItem>
          <MenuItem>Copy</MenuItem>
          <MenuItem>Paste</MenuItem>
        </SubMenu>
        <MenuItem>Print...</MenuItem>
      </Menu>

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
      {/* <ToolTab
        icon={<Icon>📏</Icon>}
        label={"32"}
        tooltip="Toggle grid visibility"
      />
      <ToolButton icon={"+"} tooltip="Increase grid size" /> */}
      <ToolButton icon={<Icon>🧲</Icon>} tooltip="Toggle magnetic grid" />
    </ToolBar>

    <div
      style={{
        height: "30em",
        display: "flex",
        flexFlow: "row nowrap",
      }}
    >
      <ResizePanel direction={ResizeDirection.East}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
          }}
        >
          <ToolBar size="small">
            <ToolButton icon={<Icon>📄</Icon>} label="+" tooltip="Add layer" />
            <ToolButton icon={<Icon>📁</Icon>} label="+" tooltip="Add folder" />
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
          <Panel padding={5}>
            <Tree dataProvider={storyTreeDataProvider} />
          </Panel>
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
    </div>
  </div>
);

export const Layers = Template.bind({});
