import type {
  AnimationControlTrack,
  AnimationVisibilityTrack,
  FrameControlAction,
  FrameLayerVisibilityAction,
} from "@geppetto/types";
import type { FC, MouseEvent } from "react";
import { useEffect, useRef, useState } from "react";

import { ControlTrackContextMenu } from "@/application/modules/animation/ui/ControlTrackContextMenu";
import { useFile } from "@/application/state/FileContext";
import useEvent from "@/application/state/hooks/useEvent";
import {
  renameAnimation,
  updateLoopingAnimation,
} from "@/domain/animation/file2/animations";
import {
  AnimationTrack as AnimationTrackComponent,
  Icon,
  Menu,
  MenuItem,
  RenameInput,
  TimeBar,
  TimeLineEndHandle,
  TimePin,
  TimePlayIndicator,
  ToolBar,
  ToolButton,
  useMenuState,
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

  const [menuProps, toggleMenu] = useMenuState();
  const [anchorPoint, setAnchorPoint] = useState({
    x: 0,
    y: 0,
  });
  const [contextMenuTrackName, setContextMenuTrackName] = useState<
    string | null
  >(null);
  const handleContextMenu = useEvent(
    (event: MouseEvent<HTMLElement>, trackName: string): void => {
      event.preventDefault();
      setAnchorPoint({
        x: event.clientX,
        y: event.clientY,
      });
      toggleMenu(true);
      setContextMenuTrackName(trackName);
    }
  );

  return (
    <>
      <ControlTrackContextMenu
        anchorPoint={anchorPoint}
        animationId={animationId}
        trackName={contextMenuTrackName ?? ""}
        {...menuProps}
        onClose={() => toggleMenu(false)}
      />
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
              <MenuItem
                checked={animation.looping}
                onClick={() => {
                  setFile(
                    updateLoopingAnimation(animationId, !animation.looping)
                  );
                }}
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
        name={
          <RenameInput
            align="right"
            onRename={(newName) => {
              setFile(renameAnimation(animationId, newName));
            }}
            value={animation.name}
          />
        }
        onLabelContextMenu={handleContextMenu}
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
        <TimePlayIndicator
          duration={animationLength / 1000}
          key="total-indicator"
          loop={animation.looping}
          playing={isPlaying}
          selected={selected}
        />
        {animation.tracks.map((track, index) => (
          <TimePlayIndicator
            duration={track.length / 1000}
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
