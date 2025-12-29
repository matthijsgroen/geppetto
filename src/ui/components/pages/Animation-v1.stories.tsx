import preview from "@sb/preview";
import { clsx } from "clsx";
import type { FC } from "react";
import { Fragment } from "react/jsx-runtime";

import {
  Column,
  Control,
  ControlPanel,
  Icon,
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
  ToolSpacer,
  ToolTab,
} from "@/ui/components";

const meta = preview.meta({
  title: "Pages/Animation",
  argTypes: {
    children: { control: false },
  },
  tags: ["svg"],
});
export default meta;

/** In Seconds */
type TimeStamp = number;

const TimePin: FC<{ location: TimeStamp; activeTrack?: boolean }> = ({
  location,
  activeTrack = false,
}) => {
  return (
    <div
      className="absolute top-0.5 bottom-0.5 z-20 w-0 border-r border-l border-dashed border-control-edge"
      style={{ left: `${location}em` }}
    >
      <div
        className={clsx(
          "cursor-grab rounded-full border border-control-edge bg-toolbar hover:bg-control-highlight",
          !activeTrack && "-ml-1.5 size-3",
          activeTrack && "-ml-2 size-4"
        )}
      ></div>
    </div>
  );
};

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
        <Panel workspace> </Panel>
        <ResizePanel
          defaultSize={250}
          direction={ResizeDirection.North}
          minSize={100}
        >
          <Panel padding="sm">
            <ToolBar>
              <PanelTitle>Animations</PanelTitle>
              <ToolButton icon={<Icon>⏮️</Icon>} tooltip="Go to start" />
              <ToolButton icon={<Icon>◀️</Icon>} tooltip="Step backward" />
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
            <div className="overflow-scroll">
              <div className="grid grid-cols-[minmax(min-content,20vw)_1fr] gap-x-1">
                <div className="sticky top-0 left-0 z-40 border-b border-control-edge bg-toolbar/70 p-2 text-right backdrop-blur-md">
                  Timeline
                </div>
                <div className="sticky top-0 z-30 border-b border-control-edge bg-toolbar/70 p-2 backdrop-blur-md">
                  Timestamps
                </div>
                {Array.from({ length: 3 }).map((_, i) => (
                  <Fragment key={i}>
                    <div className="sticky left-0 z-30 border-b border-control-edge bg-toolbar/50 px-2 py-2 text-right whitespace-nowrap backdrop-blur-md">
                      Track {i + 1}
                    </div>
                    <div className="relative w-7xl items-center border-b border-control-edge/50 bg-panel px-1 py-0.5 last:rounded-b-control nth-[4]:rounded-t-control">
                      <TimePin location={3 + i * 2} />
                      <TimePin location={10 + i} />
                    </div>
                  </Fragment>
                ))}
                <Fragment key={3}>
                  <div className="sticky left-0 z-30 border-b border-control-edge bg-control-active/50 px-2 py-1 text-right whitespace-nowrap backdrop-blur-md">
                    <Column>
                      <div className="h-5">Track {3 + 1}</div>
                      <div className="pl-4 text-sm">Control 1</div>
                      <div className="pl-4 text-sm">Control 3</div>
                      <div className="pl-4 text-sm">Control 4</div>
                      <div className="pl-4 text-sm">Control 6</div>
                    </Column>
                  </div>
                  <div className="relative w-7xl border-b border-control-edge/50 bg-panel px-1 py-0.5 last:rounded-b-control nth-[4]:rounded-t-control">
                    <div className="h-4 w-full bg-toolbar"></div>
                    <TimePin activeTrack location={3} />
                    <TimePin activeTrack location={10} />
                    <TimePin activeTrack location={25} />
                    <TimePin activeTrack location={45} />
                  </div>
                </Fragment>
                {Array.from({ length: 10 }).map((_, i) => (
                  <Fragment key={5 + i}>
                    <div className="sticky left-0 z-30 border-b border-control-edge bg-toolbar/50 px-2 py-2 text-right whitespace-nowrap backdrop-blur-md">
                      Track {i + 5}
                    </div>
                    <div className="relative w-7xl border-b border-control-edge/50 bg-panel px-1 py-0.5 last:rounded-b-control nth-[4]:rounded-t-control">
                      <TimePin location={3 + i * 2} />
                      <TimePin location={10 + i} />
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>
          </Panel>
        </ResizePanel>
      </Column>
    </Column>
  ),
});
