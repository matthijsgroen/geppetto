import type {
  AnimationControlTrack,
  AnimationVisibilityTrack,
  FrameControlAction,
  FrameLayerVisibilityAction,
} from "@geppetto/types";
import type { FC, MouseEvent } from "react";
import { use, useEffect, useRef, useState } from "react";

import ZoomContext from "@/application/modules/animation/state/ZoomContext";
import { useFile } from "@/application/state/FileContext";
import useEvent from "@/application/state/hooks/useEvent";
import {
  renameAnimation,
  updateAnimationControlTrackLength,
  updateAnimationSpeedModifier,
  updateLoopingAnimation,
} from "@/domain/animation/file2/animations";
import {
  AnimationTrack as AnimationTrackComponent,
  Icon,
  Menu,
  MenuHeader,
  MenuItem,
  MenuRadioGroup,
  RenameInput,
  SubMenu,
  TimeBar,
  TimePin,
  TimePlayIndicator,
  ToolBar,
  ToolButton,
  useMenuState,
} from "@/ui/components";

import { AnimationContextMenu } from "./AnimationContextMenu";
import { ControlTrackContextMenu } from "./ControlTrackContextMenu";
import { TrackTimeline } from "./TrackTimeLine";

export type AnimationControlFrame = {
  animationId: string;
  track: AnimationControlTrack;
  frame: FrameControlAction;
  actionIndex: number;
};

export type AnimationVisibilityFrame = {
  animationId: string;
  track: AnimationVisibilityTrack;
  frame: FrameLayerVisibilityAction;
  actionIndex: number;
};

export type AnimationFrame = AnimationControlFrame | AnimationVisibilityFrame;

type AnimationTimelineProps = {
  animationId: string;
  isPlaying?: boolean;

  onSelect: () => void;
  onPlay?: () => void;
  onStop?: () => void;
  onFrameSelect?: (frame: AnimationFrame) => void;
  onDelete?: () => void;
  selected: boolean;
  selectedTimeBar?: AnimationFrame | null;
};

const speedLabel = (speed: number) => {
  if (speed < 1) {
    return `${1 / speed}× slower`;
  }
  if (speed > 1) {
    return `${speed}× faster`;
  }
  return "Original speed";
};

export const AnimationTimeline: FC<AnimationTimelineProps> = ({
  animationId,
  isPlaying = false,
  onPlay,
  onStop,

  onSelect,
  onDelete,
  onFrameSelect,
  selected,
  selectedTimeBar,
}) => {
  const [file, setFile] = useFile();
  const animation = file.animations[animationId];

  const trackNames = animation.tracks.map((track) =>
    track.type === "control"
      ? file.controls[track.controlId].name
      : (file.layerFolders[track.layerId] ?? file.layers[track.layerId]).name
  );
  const animationLength = Math.max(
    ...animation.tracks.map((track) => {
      if (track.type === "control") {
        return track.length;
      }
      return 0;
    }),
    ...animation.events.map((event) => event.start)
  );

  const trackRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (selected && trackRef.current) {
      trackRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [selected]);

  const [controlTrackMenuProps, toggleControlTrackMenu] = useMenuState();
  const [animationTrackMenuProps, toggleAnimationTrackMenu] = useMenuState();
  const [anchorPoint, setAnchorPoint] = useState({
    x: 0,
    y: 0,
  });
  const [contextMenuTrackName, setContextMenuTrackName] = useState<
    string | null
  >(null);
  const handleControlTrackContextMenu = useEvent(
    (event: MouseEvent<HTMLElement>, trackName: string): void => {
      event.preventDefault();
      setAnchorPoint({
        x: event.clientX,
        y: event.clientY,
      });
      toggleControlTrackMenu(true);
      setContextMenuTrackName(trackName);
    }
  );
  const handleAnimationTrackContextMenu = useEvent(
    (event: MouseEvent<HTMLElement>): void => {
      event.preventDefault();
      setAnchorPoint({
        x: event.clientX,
        y: event.clientY,
      });
      toggleAnimationTrackMenu(true);
    }
  );

  const animationMenuItems = (
    <>
      <MenuHeader>Animation Options</MenuHeader>
      <MenuItem
        checked={animation.looping}
        onClick={() => {
          setFile(updateLoopingAnimation(animationId, !animation.looping));
        }}
        type="checkbox"
      >
        Loop animation
      </MenuItem>
      <SubMenu label="Speed modifier">
        <MenuRadioGroup value={animation.speedModifier ?? 1}>
          {[0.125, 0.25, 0.5, 1 / 1.5, 1, 1.5, 2, 4, 8].map((speed) => (
            <MenuItem
              key={speed}
              onClick={() => {
                setFile(updateAnimationSpeedModifier(animationId, speed));
              }}
              type="radio"
              value={speed}
            >
              {speedLabel(speed)}
            </MenuItem>
          ))}
        </MenuRadioGroup>
      </SubMenu>
      {onDelete && (
        <MenuItem dangerous onClick={onDelete} type="checkbox">
          Delete
        </MenuItem>
      )}
    </>
  );
  const speed = animation.speedModifier ?? 1;
  const { zoom } = use(ZoomContext);

  return (
    <>
      <ControlTrackContextMenu
        anchorPoint={anchorPoint}
        animationId={animationId}
        trackName={contextMenuTrackName ?? ""}
        {...controlTrackMenuProps}
        onClose={() => toggleControlTrackMenu(false)}
      />
      <AnimationContextMenu
        anchorPoint={anchorPoint}
        {...animationTrackMenuProps}
        onClose={() => toggleAnimationTrackMenu(false)}
      >
        {animationMenuItems}
      </AnimationContextMenu>
      <AnimationTrackComponent
        animationId={animationId}
        extraContent={
          <ToolBar size="minimal" transparent>
            {isPlaying ? (
              <ToolButton
                icon={<Icon colorize>■</Icon>}
                onClick={onStop}
                tooltip="Stop"
              />
            ) : (
              <ToolButton
                icon={<Icon colorize>▶</Icon>}
                onClick={onPlay}
                tooltip="Play"
              />
            )}
            <Menu
              arrow
              direction="right"
              menuButton={({ open }) => (
                <ToolButton
                  active={open}
                  icon={<Icon colorize>⋯</Icon>}
                  keyboardFocusOnly
                  tooltip="Options"
                />
              )}
              menuStyle={{ fontSize: "1rem" }}
              portal
              position="auto"
            >
              {animationMenuItems}
            </Menu>
          </ToolBar>
        }
        key={animationId}
        length={animationLength / 1000 / speed}
        loop={animation.looping}
        name={
          <RenameInput
            align="right"
            onRename={(newName) => {
              setFile(renameAnimation(animationId, newName));
            }}
            value={animation.name}
          />
        }
        onLabelContextMenu={handleAnimationTrackContextMenu}
        onSelect={onSelect}
        onTrackNameContextMenu={handleControlTrackContextMenu}
        ref={trackRef}
        selected={selected}
        trackNames={trackNames}
      >
        {animation.tracks.map((track, index) =>
          track.type === "control"
            ? track.actions.map((action, actionIndex) => (
                <TimeBar
                  duration={action.duration / 1000 / speed}
                  easing={action.easingFunction}
                  key={`${track.controlId}-${actionIndex}`}
                  onClick={() => {
                    onFrameSelect?.({
                      animationId,
                      track,
                      frame: action,
                      actionIndex,
                    });
                  }}
                  selected={
                    (selectedTimeBar &&
                      selectedTimeBar.animationId === animationId &&
                      selectedTimeBar.track.type === track.type &&
                      selectedTimeBar.track.controlId === track.controlId &&
                      selectedTimeBar.actionIndex === actionIndex) ??
                    false
                  }
                  start={action.start / 1000 / speed}
                  trackIndex={index}
                />
              ))
            : null
        )}
        {animation.tracks.map((track, index) => {
          return track.type === "control" ? (
            <TrackTimeline
              key={`${track.controlId}-end`}
              length={track.length}
              looping={animation.looping}
              onEndDrag={(newTime) => {
                setFile(
                  updateAnimationControlTrackLength(
                    animationId,
                    track.controlId,
                    newTime
                  )
                );
              }}
              speed={speed}
              trackIndex={index}
              zoom={zoom}
            />
          ) : null;
        })}
        {animation.events.map((event, eventIndex) => (
          <TimePin
            key={`event-${eventIndex}`}
            label={event.eventName}
            location={event.start / 1000 / speed}
          />
        ))}
        <TimePlayIndicator
          duration={animationLength / 1000 / speed}
          key="total-indicator"
          loop={animation.looping}
          playing={isPlaying}
          selected={selected}
        />
        {animation.tracks.map((track, index) => (
          <TimePlayIndicator
            duration={track.length / 1000 / speed}
            key={`indicator-${index}`}
            loop={animation.looping}
            playing={isPlaying}
            selected={selected}
            trackIndex={index}
          />
        ))}
      </AnimationTrackComponent>
    </>
  );
};
