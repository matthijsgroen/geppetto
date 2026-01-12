import type {
  AnimationControlTrack,
  AnimationVisibilityTrack,
  FrameControlAction,
  FrameLayerVisibilityAction,
  GeppettoImage,
} from "@geppetto/types";
import { type FC, useEffect, useRef } from "react";

import {
  AnimationTrack as AnimationTrackComponent,
  Icon,
  Menu,
  MenuItem,
  TimeBar,
  TimeLineEndHandle,
  TimePin,
  ToolBar,
  ToolButton,
} from "@/ui/components";

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
  file: GeppettoImage;
  isPlaying?: boolean;

  onSelect: () => void;
  onPlay?: () => void;
  onStop?: () => void;
  onFrameSelect?: (frame: AnimationFrame) => void;
  onDelete?: () => void;
  selected: boolean;
  selectedTimeBar?: AnimationFrame | null;
};

export const AnimationTimeline: FC<AnimationTimelineProps> = ({
  animationId,
  file,
  isPlaying = false,
  onPlay,
  onStop,

  onSelect,
  onDelete,
  onFrameSelect,
  selected,
  selectedTimeBar,
}) => {
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

  return (
    <AnimationTrackComponent
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
                tooltip="Options"
              />
            )}
            menuStyle={{ fontSize: "1rem" }}
            portal
            position="auto"
          >
            <MenuItem onClick={() => {}} type="checkbox">
              Rename
            </MenuItem>
            <MenuItem
              checked={animation.looping}
              onClick={() => {}}
              type="checkbox"
            >
              Loop animation
            </MenuItem>
            {onDelete && (
              <MenuItem dangerous onClick={onDelete} type="checkbox">
                Delete
              </MenuItem>
            )}
          </Menu>
        </ToolBar>
      }
      key={animationId}
      length={animationLength / 1000}
      loop={animation.looping}
      name={animation.name}
      onSelect={onSelect}
      ref={trackRef}
      selected={selected}
      trackNames={trackNames}
    >
      {animation.tracks.map((track, index) =>
        track.type === "control"
          ? track.actions.map((action, actionIndex) => (
              <TimeBar
                duration={action.duration / 1000}
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
                start={action.start / 1000}
                trackIndex={index}
              />
            ))
          : null
      )}
      {animation.tracks.map((track, index) => {
        return track.type === "control" ? (
          <TimeLineEndHandle
            key={`${track.controlId}-end`}
            location={track.length / 1000}
            loop={animation.looping}
            trackIndex={index}
          />
        ) : null;
      })}
      {animation.events.map((event, eventIndex) => (
        <TimePin
          key={`event-${eventIndex}`}
          label={event.eventName}
          location={event.start / 1000}
        />
      ))}
    </AnimationTrackComponent>
  );
};
