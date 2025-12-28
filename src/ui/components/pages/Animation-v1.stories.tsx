import preview from "@sb/preview";

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
  PanelTitle,
  RangeInput,
  ResizeDirection,
  ResizePanel,
  Row,
  SubMenu,
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
  title: "Pages/Animation",
  argTypes: {
    children: { control: false },
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
          portal={true}
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

        <ToolTab icon={<Icon>🧬</Icon>} label={"Layers"} />
        <ToolTab icon={<Icon>🤷🏼</Icon>} label={"Composition"} />
        <ToolTab active icon={<Icon>🏃</Icon>} label={"Animation"} />
        <ToolSeparator />

        <ToolButton icon={<Icon>🔧</Icon>} tooltip="Adjust point mode" />
        <ToolButton icon={<Icon>️▶️</Icon>} tooltip="Add point mode" />
        <ToolSeparator />
        <ToolButton
          disabled
          icon={<Icon>🗑</Icon>}
          tooltip="Remove selected point"
        />
      </ToolBar>

      <Column>
        <ResizePanel
          defaultSize={150}
          direction={ResizeDirection.South}
          minSize={100}
        >
          <Row>
            <ResizePanel
              defaultSize={175}
              direction={ResizeDirection.East}
              minSize={100}
            >
              <Panel padding="sm">
                <ControlPanel></ControlPanel>
              </Panel>
            </ResizePanel>
            <Panel padding="sm" workspace>
              {/* <TimeLineCurves />
              <TimeBox zoom={1.0}>
                <TimeEvent
                  easing={"easeOut"}
                  endTime={4000}
                  label={"Sun"}
                  row={0}
                  startTime={0}
                />
                <TimeEvent
                  easing={"easeIn"}
                  endTime={12000}
                  label={"Sun"}
                  row={0}
                  startTime={8000}
                />
              </TimeBox> */}
            </Panel>
          </Row>
        </ResizePanel>
        <Row>
          <ResizePanel
            defaultSize={225}
            direction={ResizeDirection.East}
            minSize={100}
          >
            <Panel padding="sm">
              <TreeEnvironment
                items={storyTreeItems(noToolsProvider)}
                viewState={{}}
              >
                <Tree treeId="layers" />
              </TreeEnvironment>
              <PanelTitle>Control value</PanelTitle>
              <ControlPanel>
                <Control label="Control 1">
                  <RangeInput />
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
  ),
});
