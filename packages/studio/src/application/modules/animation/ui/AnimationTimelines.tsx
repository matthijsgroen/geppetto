import { type FC, useState } from "react";

import { useFile } from "@/application/state/FileContext";
import type { AddAnimationDetails } from "@/domain/animation/file2/animations";
import {
  addAnimation,
  deleteAnimation,
  moveControlTrackToAnimation,
} from "@/domain/animation/file2/animations";
import { getControlIdByName } from "@/domain/animation/file2/testFileBuilder";
import {
  AnimationsContainer,
  Icon,
  Menu,
  MenuHeader,
  MenuItem,
  MenuRadioGroup,
  Panel,
  PanelTitle,
  ToolBar,
  ToolButton,
  ToolSeparator,
  ToolSpacer,
} from "@/ui/components";
import { TrackDragProvider } from "@/ui/components/molecules/AnimationTrack/TrackDragContext";

import type { AnimationFrame } from "./AnimationTimeline";
import { AnimationTimeline } from "./AnimationTimeline";

const EXTRA_TIME = 2000; // milliseconds

type AnimationTimelinesProps = {
  onFrameSelect?: (frame: AnimationFrame | null) => void;
  selectedFrame?: AnimationFrame | null;
  onStartAnimation?: (animationId: string) => void;
  onStopAnimation?: (animationId: string) => void;
  animationsPlaying?: string[];
};

export const AnimationTimelines: FC<AnimationTimelinesProps> = ({
  onFrameSelect,
  selectedFrame,
  onStartAnimation,
  onStopAnimation,
  animationsPlaying = [],
}) => {
  const [file, setFile] = useFile();
  const [selectedAnimation, setSelectedAnimation] = useState<string | null>(
    null
  );
  const [zoom, setZoom] = useState(2);

  const maxTime = Object.values(file.animations).reduce((max, animation) => {
    const animationMax = Math.max(
      ...animation.tracks.map((track) => track.length),
      ...animation.events.map((event) => event.start)
    );
    return Math.max(max, animationMax);
  }, 0);

  return (
    <TrackDragProvider
      onMove={(from, to) => {
        setFile((file) => {
          const controlId = getControlIdByName(file, from.track); // Ensure control exists

          return moveControlTrackToAnimation(
            from.animation,
            to.animation,
            controlId
          )(file);
        });
      }}
    >
      <Panel padding="sm">
        <ToolBar>
          <PanelTitle>Animations</PanelTitle>
          {/* <ToolButton disabled icon={<Icon>⏮️</Icon>} tooltip="Go to start" />
        <ToolButton disabled icon={<Icon>▶️</Icon>} tooltip="Play/Pause" />
        <ToolButton disabled icon={<Icon>⏭️</Icon>} tooltip="Go to end" />
        */}
          <ToolSeparator />
          <ToolButton
            icon={<Icon>➕</Icon>}
            label="Animation"
            onClick={() => {
              const addDetails: AddAnimationDetails | Record<string, never> =
                {};
              setFile(addAnimation(addDetails));
              setSelectedAnimation(addDetails.id);
            }}
            tooltip="Add Animation"
          />
          {/*
        <ToolButton
          disabled
          icon={<Icon>➕</Icon>}
          label="Event"
          tooltip="Add Event"
        />
        <ToolButton
          disabled
          icon={<Icon>➕</Icon>}
          label="Control"
          tooltip="Add Control layer"
        />*/}
          <Menu
            align="center"
            arrow
            direction="bottom"
            menuButton={({ open }) => (
              <ToolButton
                active={open}
                icon={<Icon>🔎</Icon>}
                tooltip="Zoom level"
              />
            )}
            portal
            transition
          >
            <MenuHeader>Zoom level</MenuHeader>
            <MenuRadioGroup value={zoom}>
              {[0.25, 0.5, 1, 4, 12].map((zoomLevel) => (
                <MenuItem
                  key={`zoom${zoomLevel}`}
                  onClick={() => {
                    setZoom(zoomLevel);
                  }}
                  type="radio"
                  value={zoomLevel}
                >
                  {zoomLevel}×
                </MenuItem>
              ))}
            </MenuRadioGroup>
          </Menu>
          <ToolSpacer />
          <ToolButton disabled icon={<Icon colorize>?</Icon>} tooltip="Help" />
        </ToolBar>
        <AnimationsContainer
          duration={(maxTime + EXTRA_TIME) / 1000}
          onZoomChange={setZoom}
          title="Timeline"
          zoom={zoom}
        >
          {Object.keys(file.animations).map((animationId) => (
            <AnimationTimeline
              animationId={animationId}
              isPlaying={animationsPlaying.includes(animationId)}
              key={animationId}
              onDelete={() => {
                setFile(deleteAnimation(animationId));
                setSelectedAnimation(null);
              }}
              onFrameSelect={onFrameSelect}
              onPlay={() => {
                onStartAnimation?.(animationId);
              }}
              onSelect={() => {
                setSelectedAnimation(animationId);
                if (animationId !== selectedFrame?.animationId) {
                  onFrameSelect?.(null);
                }
              }}
              onStop={() => {
                onStopAnimation?.(animationId);
              }}
              selected={selectedAnimation === animationId}
              selectedTimeBar={
                selectedAnimation === animationId ? selectedFrame : null
              }
            />
          ))}
        </AnimationsContainer>
      </Panel>
    </TrackDragProvider>
  );
};
