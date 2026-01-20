import { type FC, useState } from "react";

import ZoomContext from "@/application/modules/animation/state/ZoomContext";
import { useFile } from "@/application/state/FileContext";
import type { AddAnimationDetails } from "@/domain/animation/file2/animations";
import {
  addAnimation,
  createAnimationControlTrack,
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
      ...animation.tracks.map(
        (track) => track.length / (animation.speedModifier ?? 1)
      ),
      ...animation.events.map(
        (event) => event.start / (animation.speedModifier ?? 1)
      )
    );
    return Math.max(max, animationMax);
  }, 0);
  const animation = selectedAnimation
    ? file.animations[selectedAnimation]
    : null;

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
      <ZoomContext.Provider value={{ zoom }}>
        <Panel padding="sm">
          <ToolBar>
            <PanelTitle>Animations</PanelTitle>
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
            <Menu
              align="center"
              arrow
              direction="top"
              menuButton={({ open }) => (
                <ToolButton
                  active={open}
                  disabled={animation === null}
                  icon={<Icon>➕</Icon>}
                  label="Track"
                  tooltip="Add Control track"
                />
              )}
              portal
              transition
            >
              <MenuHeader>Add Control Track</MenuHeader>
              {Object.entries(file.controls)
                .filter(
                  ([id]) =>
                    !animation?.tracks.some(
                      (track) =>
                        track.type === "control" && track.controlId === id
                    )
                )
                .map(([id, control]) => (
                  <MenuItem
                    key={id}
                    onClick={() => {
                      setFile(
                        createAnimationControlTrack(selectedAnimation!, id)
                      );
                    }}
                  >
                    {control.name}
                  </MenuItem>
                ))}
            </Menu>
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
      </ZoomContext.Provider>
    </TrackDragProvider>
  );
};
