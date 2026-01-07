import preview from "@sb/preview";

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
  Paragraph,
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
} from "@/ui/components";
import {
  storyTreeItems,
  type ToolsProvider,
} from "@/ui/components/organisms/Tree/storybookTreeDataProvider";

const meta = preview.meta({
  title: "Pages/Layers",
  parameters: {
    layout: "fullscreen",
  },
  tags: ["svg"],
});
export default meta;

const noToolsProvider: ToolsProvider = () => null;

export const Version1 = meta.story({
  render: () => (
    <Column>
      <ToolBar>
        <Menu
          menuButton={({ open }) => (
            <ToolButton
              active={open}
              icon={<LogoIcon />}
              label="Geppetto"
              notificationBadge
            />
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

        <ToolTab active icon={<Icon>🧬</Icon>} label="Layers" />
        <ToolTab icon={<Icon>🤷🏼</Icon>} label="Composition" />
        <ToolTab icon={<Icon>🏃</Icon>} label="Animation" />
        <ToolSeparator />

        <ToolButton active icon={<Icon>✋</Icon>} tooltip="Move mode" />
        <ToolButton icon={<Icon>🔧</Icon>} tooltip="Adjust point mode" />
        <ToolButton icon={<Icon>✏️</Icon>} tooltip="Add point mode" />
        <ToolSeparator />
        <ToolButton
          disabled
          icon={<Icon>🗑</Icon>}
          tooltip="Remove selected point"
        />
        <ToolSeparator />
        <ToolButton icon={<Icon>📏</Icon>} tooltip="Toggle grid visibility" />
        <Menu
          align="center"
          arrow
          direction="bottom"
          menuButton={({ open }) => <ToolButton active={open} label="32" />}
          portal
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
          defaultSize={250}
          direction={ResizeDirection.East}
          minSize={100}
        >
          <Column>
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
            <Panel padding="sm">
              <TreeEnvironment
                items={storyTreeItems(noToolsProvider)}
                viewState={{}}
              >
                <Tree treeId="layers" />
              </TreeEnvironment>
            </Panel>
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
      </Row>
    </Column>
  ),
});
