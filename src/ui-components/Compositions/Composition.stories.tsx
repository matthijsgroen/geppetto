import { Story } from "@storybook/react";
import {
  Column,
  Icon,
  Kbd,
  Menu,
  MenuDivider,
  MenuHeader,
  MenuItem,
  MenuRadioGroup,
  Panel,
  ResizeDirection,
  ResizePanel,
  Row,
  SubMenu,
  Title,
  ToolBar,
  ToolButton,
  ToolSeparator,
  ToolTab,
  Tree,
  UncontrolledTreeEnvironment,
  ControlPanel,
  Control,
} from "../";
import { storyTreeDataProvider } from "../Tree/storybookTreeDataProvider";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const story = {
  title: "Compositions/Layers",
  argTypes: {
    children: { control: false, table: false },
  },
};
export default story;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: Story = () => (
  <Column>
    <ToolBar>
      <Menu
        portal={true}
        transition
        menuButton={({ open }) => (
          <ToolButton icon={<Icon>🍔</Icon>} active={open} notificationBadge />
        )}
      >
        <MenuItem>↻ Restart for app update...</MenuItem>
        <MenuItem>⇣ Install application locally</MenuItem>
        <SubMenu label="File">
          <MenuItem>New</MenuItem>
          <MenuDivider />
          <MenuItem>Open</MenuItem>
          <MenuItem>Load texture</MenuItem>
          <MenuDivider />
          <MenuItem>Reload texture</MenuItem>
          <MenuDivider />
          <MenuItem disabled>Save</MenuItem>
          <MenuItem>Save as...</MenuItem>
        </SubMenu>
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
      <ResizePanel
        direction={ResizeDirection.East}
        minSize={100}
        defaultSize={200}
      >
        <Column>
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
          </ToolBar>
          <Panel padding={5}>
            <UncontrolledTreeEnvironment dataProvider={storyTreeDataProvider()}>
              <Tree treeId="layers" />
            </UncontrolledTreeEnvironment>
          </Panel>
          <ResizePanel
            direction={ResizeDirection.North}
            minSize={200}
            defaultSize={300}
          >
            <Panel padding={5}>
              <Title>Controls</Title>
              <ToolBar size="small">
                <ToolButton
                  icon={<Icon>⚙️</Icon>}
                  label="+"
                  tooltip="Add control"
                />
                <ToolButton
                  icon={<Icon>🗑</Icon>}
                  disabled={true}
                  tooltip="Remove item"
                />
              </ToolBar>
              <UncontrolledTreeEnvironment
                dataProvider={storyTreeDataProvider()}
              >
                <Tree treeId="controls" />
              </UncontrolledTreeEnvironment>
              <Title>Left Arm</Title>
              <ControlPanel>
                <Control label="Value">
                  <input type="range" />
                </Control>
                <Control label="Steps">
                  <ToolButton icon={"1"} size={"small"} />
                  <ToolButton icon={"2"} size={"small"} />
                  <ToolButton icon={"+"} size={"small"} />
                </Control>
              </ControlPanel>
            </Panel>
          </ResizePanel>
        </Column>
      </ResizePanel>
      <Panel center workspace>
        <div>
          <h1>Welcome to Geppetto</h1>
          <p>Some introduction text here...</p>
          <p>
            <ToolButton
              icon={<Icon>📄</Icon>}
              label="Load file..."
              size={"small"}
              shadow
            />{" "}
            <Kbd shortcut={{ key: "KeyO", ctrlOrCmd: true }} />
          </p>
        </div>
      </Panel>
    </Row>
  </Column>
);

export const Layers = Template.bind({});
