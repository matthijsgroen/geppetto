import type {
  AnimationControlTrack,
  AnimationVisibilityTrack,
  FrameControlAction,
  FrameLayerVisibilityAction,
} from "@geppetto/types";
import type { FC, MouseEvent } from "react";
import { use, useEffect, useRef, useState } from "react";

import ZoomContext from "@/application/modules/animation/state/ZoomContext";
import { AnimationSpeedOptions } from "@/application/modules/animation/ui/AnimationSpeedOptions";
import { TrackControlFrame } from "@/application/modules/animation/ui/TrackControlFrame";
import { useFile } from "@/application/state/FileContext";
import useEvent from "@/application/state/hooks/useEvent";
import {
  addControlFrameToAnimation,
  deleteControlFrame,
  getAnimationDuration,
  renameAnimation,
  resizeControlFrame,
  updateAnimationControlTrackLength,
  updateAutoplayAnimation,
  updateLoopingAnimation,
} from "@/domain/animation/file2/animations";
import {
  AnimationTrack as AnimationTrackComponent,
  Icon,
  Menu,
  MenuHeader,
  MenuItem,
  RenameInput,
  SubMenu,
  TimePin,
  TimePlayIndicator,
  ToolBar,
  ToolButton,
  useMenuState,
} from "@/ui/components";

import { AnimationContextMenu } from "./AnimationContextMenu";
import { ControlTrackContextMenu } from "./ControlTrackContextMenu";
import { TrackTimeline } from "./TrackTimeline";

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
  onFrameSelect?: (frame: AnimationFrame | null) => void;
  onEventSelect?: (eventId: string | null) => void;
  selectedEvent?: string | null;
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
  onEventSelect,
  selected,
  selectedTimeBar,
  selectedEvent,
}) => {
  const [file, setFile] = useFile();
  const animation = file.animations[animationId];

  const trackNames = animation.tracks.map((track) =>
    track.type === "control"
      ? file.controls[track.controlId].name
      : (file.layerFolders[track.layerId] ?? file.layers[track.layerId]).name
  );
  const animationDuration = getAnimationDuration(animation);

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
      <MenuItem
        checked={animation.autoplay ?? false}
        onClick={() => {
          setFile(updateAutoplayAnimation(animationId, !animation.autoplay));
        }}
        type="checkbox"
      >
        Autoplay animation
      </MenuItem>
      <SubMenu label="Speed modifier">
        <AnimationSpeedOptions animationId={animationId} />
      </SubMenu>
      {onDelete && (
        <MenuItem dangerous onClick={onDelete} type="checkbox">
          Delete Animation
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
                icon={
                  <Icon active={animation.autoplay ?? false} colorize>
                    ▶
                  </Icon>
                }
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
        length={animationDuration / 1000}
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
                <TrackControlFrame
                  action={action}
                  actionIndex={actionIndex}
                  control={file.controls[track.controlId]}
                  key={`${track.controlId}-${actionIndex}`}
                  onDelete={() => {
                    setFile(
                      deleteControlFrame(
                        animationId,
                        track.controlId,
                        actionIndex
                      )
                    );
                    onFrameSelect?.(null);
                  }}
                  onDeselect={() => {
                    onFrameSelect?.(null);
                  }}
                  onResize={(newStart, newDuration) => {
                    setFile(
                      resizeControlFrame(
                        animationId,
                        track.controlId,
                        actionIndex,
                        newStart,
                        newDuration
                      )
                    );
                  }}
                  onSelect={() => {
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
                  speed={speed}
                  track={track}
                  trackIndex={index}
                  zoom={zoom}
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
              onAddFrame={(startTime) => {
                setFile(
                  addControlFrameToAnimation(
                    animationId,
                    track.controlId,
                    startTime,
                    500,
                    0
                  )
                );
              }}
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
        {animation.events.map((event) => (
          <TimePin
            key={event.id}
            label={event.eventName}
            location={event.start / 1000 / speed}
            onClick={() => {
              onEventSelect?.(event.id);
            }}
            selected={selectedEvent === event.id}
            zoom={zoom}
          />
        ))}
        <TimePlayIndicator
          duration={animationDuration / 1000}
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
