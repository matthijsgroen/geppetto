import preview from "@sb/preview";

import {
  storyTreeItems,
  type ToolsProvider,
} from "@/ui/components/organisms/Tree/storybookTreeDataProvider";

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
        <ToolButton active icon={<Icon>👁</Icon>} />
      </>
    );
  }
  if (data.type === "mutation") {
    return (
      <>
        <ToolButton active={data.name === "Mutation"} icon={<Icon>📍</Icon>} />
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
          menuButton={({ open }) => (
            <ToolButton active={open} icon={<LogoIcon />} notificationBadge />
          )}
          portal
          transition
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
        <ToolTab active icon={<Icon>🤷🏼</Icon>} label="Composition" />
        <ToolTab icon={<Icon>🏃</Icon>} label="Animation" />
        <ToolSeparator />

        <ToolSpacer />
        <ToolButton active icon={<Icon>ℹ</Icon>} tooltip="Vector information" />
      </ToolBar>

      <Row>
        <ResizePanel
          defaultSize={250}
          direction={ResizeDirection.East}
          minSize={100}
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
                  disabled
                  icon={<Icon>📑</Icon>}
                  tooltip="Copy layer"
                />
                <ToolButton
                  disabled
                  icon={<Icon>🗑</Icon>}
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
              defaultSize={300}
              direction={ResizeDirection.North}
              minSize={200}
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
                    disabled
                    icon={<Icon>🗑</Icon>}
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
          defaultSize={250}
          direction={ResizeDirection.West}
          minSize={100}
        >
          <Column>
            <Panel padding="sm">
              <PanelTitle>Opacity (4)</PanelTitle>
              <ControlPanel>
                <Control label="Visible">
                  <ToggleInput checked />
                </Control>
                <Control label="Origin">
                  <NumberInput prefix="x:" value={10} />
                  <NumberInput prefix="y:" value={20} />
                </Control>
                <Control label="Value">
                  <NumberInput prefix="x:" value={10} />
                  <NumberInput prefix="y:" value={20} />
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
