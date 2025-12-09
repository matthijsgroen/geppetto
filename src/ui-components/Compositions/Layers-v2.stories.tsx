import { Story } from "@storybook/react-webpack5";
import {
  Column,
  Icon,
  Kbd,
  Logo,
  LogoIcon,
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
  TreeEnvironment,
} from "..";
import {
  storyTreeItems,
  ToolsProvider,
} from "../Tree/storybookTreeDataProvider";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const story = {
  title: "Compositions/Layers",
  argTypes: {
    children: { control: false, table: false },
  },
};
export default story;

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

      <ToolTab icon={<Icon>🧬</Icon>} label={"Layers"} active />
      <ToolTab icon={<Icon>🤷🏼</Icon>} label={"Composition"} />
      <ToolTab icon={<Icon>🏃</Icon>} label={"Animation"} />
    </ToolBar>
    <ResizePanel
      direction={ResizeDirection.East}
      minSize={100}
      defaultSize={250}
    >
      <Column>
        <Panel padding="sm">
          <Title>Layers</Title>
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
          <TreeEnvironment
            items={storyTreeItems(noToolsProvider)}
            viewState={{}}
          >
            <Tree treeId="layers" />
          </TreeEnvironment>
        </Panel>
      </Column>
    </ResizePanel>

    <Column>
      <ToolBar>
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
      </Row>
    </Column>
  </Row>
);

export const Version2 = Template.bind({});
