import preview from "@sb/preview";
import { clsx } from "clsx";
import type { FC } from "react";
import { Fragment } from "react/jsx-runtime";

import {
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
  Panel,
  PanelTitle,
  RangeInput,
  RangeValue,
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
import { Easing } from "storybook/theming";
import { EasingFunction } from "@/dtos/animation-file2.dto";

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
      className="absolute top-0.5 bottom-0.5 z-20 w-0 border-x border-dashed border-control-edge"
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

const TimeStretchHandle: FC = () => {
  return (
    <div className="h-4 w-1 cursor-ew-resize border-x border-control-edge hover:bg-control-active"></div>
  );
};

const TimeCurve: FC<{
  variant: EasingFunction;
}> = ({ variant }) => {
  return (
    <div
      className={clsx(
        "h-full flex-1 bg-control-focus/50",
        variant === "linear" && "clip-linear",
        variant === "easeIn" && "clip-ease-in",
        variant === "easeOut" && "clip-ease-out",
        variant === "easeInOut" && "clip-ease-in-out"
      )}
    ></div>
  );
};

const TimeBar: FC<{
  start: number;
  duration: number;
  selected?: boolean;
  trackIndex: number;
  easing?: EasingFunction;
}> = ({ start, duration, selected = false, trackIndex, easing }) => {
  return (
    <div
      className={clsx(
        "absolute z-10 flex h-5 cursor-pointer items-center justify-between gap-0.5 rounded-control-small border shadow-sm hover:bg-control-highlight",
        selected && "border-control-focus bg-control-active",
        !selected && "border-control-edge bg-toolbar"
      )}
      style={{
        left: `${start}em`,
        width: `${duration}em`,
        top: `calc(${(trackIndex + 1) * 5} * var(--spacing))`,
      }}
    >
      <TimeStretchHandle />
      {easing && <TimeCurve variant={easing} />}
      <TimeStretchHandle />
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
                <select>
                  <option value="linear">Linear</option>
                  <option value="easeIn">Ease In</option>
                  <option value="easeOut">Ease Out</option>
                  <option value="easeInOut">Ease In Out</option>
                </select>
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
                      <div className="h-5 pl-4 text-sm">Control 1</div>
                      <div className="h-5 pl-4 text-sm">Control 3</div>
                      <div className="h-5 pl-4 text-sm">Control 4</div>
                    </Column>
                  </div>
                  <div className="relative w-7xl border-b border-control-edge/50 bg-panel px-1 py-0.5 last:rounded-b-control nth-[4]:rounded-t-control">
                    <div className="h-4 w-full bg-toolbar"></div>
                    <TimeBar
                      duration={5}
                      selected
                      start={10}
                      trackIndex={0}
                      easing="easeInOut"
                    />
                    <TimeBar
                      duration={8}
                      start={20}
                      trackIndex={0}
                      easing="linear"
                    />
                    <TimeBar
                      duration={14}
                      start={7}
                      trackIndex={1}
                      easing="easeIn"
                    />
                    <TimeBar
                      duration={14}
                      start={12}
                      trackIndex={2}
                      easing="easeOut"
                    />

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
