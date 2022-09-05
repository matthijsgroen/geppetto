import { Story } from "@storybook/react";
import {
  Column,
  Control,
  ControlPanel,
  Icon,
  Kbd,
  Logo,
  LogoIcon,
  Menu,
  MenuDivider,
  MenuHeader,
  MenuItem,
  NumberInput,
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
  TreeEnvironment,
} from "..";
import {
  storyTreeItems,
  ToolsProvider,
} from "../Tree/storybookTreeDataProvider";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const story = {
  title: "Compositions/Composition",
  argTypes: {
    children: { control: false, table: false },
  },
};
export default story;

const toolsProvider: ToolsProvider = (data) => {
  if (data.type === "layer" || data.type === "layerFolder") {
    return (
      <>
        <ToolButton size="small" icon={<Icon>👁</Icon>} active />
      </>
    );
  }
};

const noToolsProvider: ToolsProvider = () => null;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: Story = () => (
  <Row>
    <ToolBar vertical>
      <Menu
        portal={true}
        transition
        menuButton={({ open }) => (
          <ToolButton icon={<LogoIcon />} active={open} notificationBadge />
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

      <ToolSeparator />
      <ToolTab icon={<Icon>🧬</Icon>} label={"Layers"} />
      <ToolTab icon={<Icon>🤷🏼</Icon>} label={"Composition"} active />
      <ToolTab icon={<Icon>🏃</Icon>} label={"Animation"} />
    </ToolBar>

    <ResizePanel
      direction={ResizeDirection.East}
      minSize={100}
      defaultSize={250}
    >
      <Column>
        <Panel padding={5}>
          <Title>Composition</Title>
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
          <TreeEnvironment items={storyTreeItems(toolsProvider)} viewState={{}}>
            <Tree treeId="layers" />
          </TreeEnvironment>
          <Title>Opacity (4)</Title>
          <ControlPanel>
            <Control label="Visible">
              <input type="checkbox" />
            </Control>
            <Control label="Origin">
              <NumberInput value={10} prefix="x:" />
              <NumberInput value={20} prefix="y:" />
            </Control>
            <Control label="Value">
              <NumberInput value={10} prefix="x:" />
              <NumberInput value={20} prefix="y:" />
            </Control>
            <Control label="Use Radius">
              <input type="checkbox" checked />
            </Control>
            <Control label="Radius">
              <NumberInput value={10} />
            </Control>
            <Control>
              <ToolButton label={"Add mutation to control"} size={"small"} />
            </Control>
          </ControlPanel>
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
            <TreeEnvironment
              items={storyTreeItems(noToolsProvider)}
              viewState={{}}
            >
              <Tree treeId="controls" />
            </TreeEnvironment>
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
    <Column>
      <Panel center workspace>
        <div>
          <Logo />
          <h1>Welcome to Geppetto</h1>
          <p>Some introduction text here...</p>
          <p>
            <ToolButton
              icon={<Icon>📄</Icon>}
              label="Load file..."
              size={"small"}
              shadow
            />{" "}
            <Kbd shortcut={{ interaction: "KeyO", ctrlOrCmd: true }} />
          </p>
        </div>
      </Panel>
    </Column>
  </Row>
);

export const Version2 = Template.bind({});
