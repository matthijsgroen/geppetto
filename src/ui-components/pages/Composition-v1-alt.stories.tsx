import preview from "#.storybook/preview";

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
  PanelTitle,
  Paragraph,
  RangeInput,
  ResizeDirection,
  ResizePanel,
  Row,
  SubMenu,
  Title,
  ToggleInput,
  ToolBar,
  ToolButton,
  ToolSeparator,
  ToolSpacer,
  ToolTab,
  Tree,
  TreeEnvironment,
} from "..";
import {
  storyTreeItems,
  type ToolsProvider,
} from "../organisms/Tree/storybookTreeDataProvider";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = preview.meta({
  title: "Pages/Composition",
  tags: ["svg"],
});
export default meta;

const toolsProvider: ToolsProvider = (data) => {
  if (data.type === "layer" || data.type === "layerFolder") {
    return (
      <>
        <ToolButton icon={<Icon>👁</Icon>} active />
      </>
    );
  }
  if (data.type === "mutation") {
    return (
      <>
        <ToolButton icon={<Icon>📍</Icon>} active={data.name === "Mutation"} />
      </>
    );
  }
};

const noToolsProvider: ToolsProvider = () => null;

export const Version1Alt = meta.story({
  render: () => (
    <Column>
      <ToolBar>
        <Menu
          portal
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

        <ToolTab icon={<Icon>🧬</Icon>} label="Layers" />
        <ToolTab icon={<Icon>🤷🏼</Icon>} label="Composition" active />
        <ToolTab icon={<Icon>🏃</Icon>} label="Animation" />
        <ToolSeparator />

        <ToolSpacer />
        <ToolButton icon={<Icon>ℹ</Icon>} tooltip="Vector information" active />
      </ToolBar>

      <Row>
        <ResizePanel
          direction={ResizeDirection.East}
          minSize={100}
          defaultSize={250}
        >
          <Column>
            <Panel padding="sm">
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
                  disabled
                  tooltip="Copy layer"
                />
                <ToolButton
                  icon={<Icon>🗑</Icon>}
                  disabled
                  tooltip="Remove item"
                />
              </ToolBar>
              <TreeEnvironment
                items={storyTreeItems(toolsProvider)}
                viewState={{}}
              >
                <Tree treeId="layers" />
              </TreeEnvironment>
            </Panel>
            <ResizePanel
              direction={ResizeDirection.North}
              minSize={200}
              defaultSize={300}
            >
              <Panel padding="sm">
                <PanelTitle>Controls</PanelTitle>
                <ToolBar size="small">
                  <ToolButton
                    icon={<Icon>⚙️</Icon>}
                    label="+"
                    tooltip="Add control"
                  />
                  <ToolButton
                    icon={<Icon>🗑</Icon>}
                    disabled
                    tooltip="Remove item"
                  />
                </ToolBar>
                <TreeEnvironment
                  items={storyTreeItems(noToolsProvider)}
                  viewState={{}}
                >
                  <Tree treeId="controls" />
                </TreeEnvironment>
                <PanelTitle>Left Arm</PanelTitle>
                <ControlPanel>
                  <Control label="Value">
                    <RangeInput />
                  </Control>
                  <Control label="Steps">
                    <ToolButton icon="1" size="small" />
                    <ToolButton icon="2" size="small" />
                    <ToolButton icon="+" size="small" />
                  </Control>
                </ControlPanel>
              </Panel>
            </ResizePanel>
          </Column>
        </ResizePanel>
        <Panel center workspace>
          <div>
            <Logo />
            <Title>Welcome to Geppetto</Title>
            <Paragraph>Some introduction text here...</Paragraph>
            <Paragraph>
              <ToolButton
                icon={<Icon>📄</Icon>}
                label="Load file..."
                size="small"
                standAlone
              />{" "}
              <Kbd shortcut={{ interaction: "KeyO", ctrlOrCmd: true }} />
            </Paragraph>
          </div>
        </Panel>
        <ResizePanel
          direction={ResizeDirection.West}
          minSize={100}
          defaultSize={250}
        >
          <Column>
            <Panel padding="sm">
              <PanelTitle>Opacity (4)</PanelTitle>
              <ControlPanel>
                <Control label="Visible">
                  <ToggleInput checked />
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
                  <ToggleInput checked />
                </Control>
                <Control label="Radius">
                  <NumberInput value={10} />
                </Control>
                <Control>
                  <ToolButton label="Add mutation to control" size="small" />
                </Control>
              </ControlPanel>
            </Panel>
          </Column>
        </ResizePanel>
      </Row>
    </Column>
  ),
});
