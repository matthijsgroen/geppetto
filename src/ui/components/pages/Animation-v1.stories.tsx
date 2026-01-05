import preview from "@sb/preview";

import {
  AnimationsContainer,
  AnimationTrack,
  Column,
  Control,
  ControlPanel,
  Icon,
  Inlay,
  LogoIcon,
  Menu,
  MenuDivider,
  MenuHeader,
  MenuItem,
  MenuRadioGroup,
  Panel,
  PanelTitle,
  RangeInput,
  RangeValue,
  ResizeDirection,
  ResizePanel,
  SubMenu,
  TimeBar,
  TimeCurve,
  TimePin,
  ToolBar,
  ToolButton,
  ToolSeparator,
  ToolSpacer,
  ToolTab,
} from "@/ui/components";

const meta = preview.meta({
  title: "Pages/Animation",
  argTypes: {
    children: { control: false },
  },
  parameters: {
    layout: "fullscreen",
  },
  tags: ["svg"],
});
export default meta;

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
      </ToolBar>
      <Column>
        <Panel workspace>
          <Inlay>
            <ControlPanel>
              <Control label="Control">
                <select>
                  <option value="control1">Control 1</option>
                  <option value="control2">Control 2</option>
                  <option value="control3">Control 3</option>
                </select>
              </Control>
              <Control label="End value">
                <Column>
                  <RangeInput defaultValue={1} max={5} min={0.1} step={0.1} />
                  <RangeValue value={1} />
                </Column>
              </Control>
              <Control label="Easing function">
                <Menu
                  align="center"
                  arrow
                  direction="bottom"
                  menuButton={({ open }) => (
                    <ToolButton
                      active={open}
                      label={
                        <>
                          <TimeCurve size="option" variant="linear" /> Linear
                        </>
                      }
                    />
                  )}
                  portal
                  transition
                >
                  <MenuRadioGroup value={"linear"}>
                    {(
                      ["linear", "easeIn", "easeOut", "easeInOut"] as const
                    ).map((timing) => (
                      <MenuItem
                        key={`timing${timing}`}
                        onClick={() => {}}
                        type="radio"
                        value={timing}
                      >
                        <TimeCurve size="option" variant={timing} /> {timing}
                      </MenuItem>
                    ))}
                  </MenuRadioGroup>
                </Menu>
              </Control>
              <Control>
                <ToolButton label="Done" standAlone />
              </Control>
            </ControlPanel>
          </Inlay>
        </Panel>
        <ResizePanel
          defaultSize={250}
          direction={ResizeDirection.North}
          minSize={100}
        >
          <Panel padding="sm">
            <ToolBar>
              <PanelTitle>Animations</PanelTitle>
              <ToolButton icon={<Icon>⏮️</Icon>} tooltip="Go to start" />
              <ToolButton icon={<Icon>▶️</Icon>} tooltip="Play/Pause" />
              <ToolButton icon={<Icon>⏭️</Icon>} tooltip="Go to end" />
              <ToolSeparator />
              <ToolButton
                icon={<Icon>➕</Icon>}
                label="Animation"
                tooltip="Add Animation track"
              />
              <ToolButton
                icon={<Icon>➕</Icon>}
                label="Event"
                tooltip="Add Event"
              />
              <ToolButton
                icon={<Icon>➕</Icon>}
                label="Control"
                tooltip="Add Control layer"
              />
              <ToolSpacer />
              <ToolButton icon={<Icon>?</Icon>} tooltip="Help" />
            </ToolBar>
            <AnimationsContainer duration={60} zoom={1}>
              {Array.from({ length: 3 }).map((_, i) => (
                <AnimationTrack key={i} name={`Track ${1 + i}`}>
                  <TimePin location={3 + i * 2} />
                  <TimePin location={10 + i} />
                  <TimeBar
                    duration={5}
                    easing="easeInOut"
                    start={10}
                    trackIndex={0}
                  />
                  <TimeBar
                    duration={5}
                    easing="easeInOut"
                    start={12}
                    trackIndex={1}
                  />
                </AnimationTrack>
              ))}
              <AnimationTrack
                controlNames={["Control 1", "Control 3", "Control 4"]}
                key={3}
                name={`Track 4`}
                selected
              >
                <TimeBar
                  duration={5}
                  easing="easeInOut"
                  selected
                  start={10}
                  trackIndex={0}
                />
                <TimeBar
                  duration={8}
                  easing="linear"
                  start={20}
                  trackIndex={0}
                />
                <TimeBar
                  duration={14}
                  easing="easeIn"
                  start={7}
                  trackIndex={1}
                />
                <TimeBar
                  duration={14}
                  easing="easeOut"
                  start={12}
                  trackIndex={2}
                />

                <TimePin location={3} />
                <TimePin location={10} />
                <TimePin location={25} />
                <TimePin location={45} />
              </AnimationTrack>
              {Array.from({ length: 10 }).map((_, i) => (
                <AnimationTrack key={5 + i} name={`Track ${5 + i}`}>
                  <TimePin location={3 + i * 2} />
                  <TimePin location={10 + i} />
                </AnimationTrack>
              ))}
            </AnimationsContainer>
          </Panel>
        </ResizePanel>
      </Column>
    </Column>
  ),
});
