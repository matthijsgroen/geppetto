import { Story } from "@storybook/react";
import {
  Column,
  Control,
  ControlPanel,
  Icon,
  Logo,
  LogoIcon,
  Menu,
  MenuDivider,
  MenuHeader,
  MenuItem,
  Panel,
  ResizeDirection,
  ResizePanel,
  Row,
  SubMenu,
  TimeBox,
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
  title: "Compositions/Animation",
  argTypes: {
    children: { control: false, table: false },
  },
};
export default story;

const toolsProvider: ToolsProvider = (data) => {
  if (data.type === "layer" || data.type === "layerFolder") {
    return (
      <>
        <ToolButton size="small" icon={<Icon>▶️</Icon>} active />
      </>
    );
  }
  if (data.type === "mutation") {
    return (
      <>
        <ToolButton
          size="small"
          icon={<Icon>📍</Icon>}
          active={data.name === "Mutation"}
        />
      </>
    );
  }
};

const noToolsProvider: ToolsProvider = () => null;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: Story = () => (
  <Column>
    <ToolBar>
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
      <ToolTab icon={<Icon>🤷🏼</Icon>} label={"Composition"} />
      <ToolTab icon={<Icon>🏃</Icon>} label={"Animation"} active />
      <ToolSeparator />

      <ToolButton icon={<Icon>🔧</Icon>} tooltip="Adjust point mode" />
      <ToolButton icon={<Icon>️▶️</Icon>} tooltip="Add point mode" />
      <ToolSeparator />
      <ToolButton
        icon={<Icon>🗑</Icon>}
        disabled
        tooltip="Remove selected point"
      />
    </ToolBar>

    <Column>
      <ResizePanel
        direction={ResizeDirection.South}
        minSize={100}
        defaultSize={150}
      >
        <Row>
          <ResizePanel
            direction={ResizeDirection.East}
            minSize={100}
            defaultSize={175}
          >
            <Panel padding={5}>
              <TreeEnvironment
                items={storyTreeItems(toolsProvider)}
                viewState={{}}
              >
                <Tree treeId="layers" />
              </TreeEnvironment>
            </Panel>
          </ResizePanel>
          <Panel padding={5} center workspace scrollable>
            <TimeBox zoom={1.0}></TimeBox>
          </Panel>
        </Row>
      </ResizePanel>
      <Row>
        <ResizePanel
          direction={ResizeDirection.East}
          minSize={100}
          defaultSize={225}
        >
          <Panel padding={5}>
            <TreeEnvironment
              items={storyTreeItems(noToolsProvider)}
              viewState={{}}
            >
              <Tree treeId="layers" />
            </TreeEnvironment>
            <Title>Control value</Title>
            <ControlPanel>
              <Control label="Control 1">
                <input type="range" />
              </Control>
            </ControlPanel>
          </Panel>
        </ResizePanel>
        <Panel center workspace>
          <div>
            <Logo />
            <h1>Welcome to Geppetto</h1>
            <p>Animation display here</p>
          </div>
        </Panel>
      </Row>
    </Column>
  </Column>
);

export const Version1 = Template.bind({});
