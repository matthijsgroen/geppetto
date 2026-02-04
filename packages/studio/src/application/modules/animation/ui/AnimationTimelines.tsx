import { type FC, useCallback, useState } from "react";

import {
  usePlayerControls,
  usePlayerTimestamp,
} from "@/application/modules/animation/state/PlayerControlsProvider";
import ZoomContext from "@/application/modules/animation/state/ZoomContext";
import { useFile } from "@/application/state/FileContext";
import type { AddAnimationDetails } from "@/domain/animation/file2/animations";
import {
  addAnimation,
  createAnimationControlTrack,
  deleteAnimation,
  getAnimationDuration,
  moveControlTrackToAnimation,
  reorderControlTrackInAnimation,
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
  onStartAnimations?: (animationIds: string[]) => void;
  onStopAnimations?: (animationIds: string[]) => void;
  selectedAnimation?: string | null;
  onSelectAnimation?: (animationId: string | null) => void;
  animationsPlaying?: string[];
};

export const AnimationTimelines: FC<AnimationTimelinesProps> = ({
  onFrameSelect,
  selectedFrame,
  selectedAnimation,
  onStartAnimations,
  onStopAnimations,
  onSelectAnimation,
  animationsPlaying = [],
}) => {
  const [file, setFile] = useFile();
  const [zoom, setZoom] = useState(2);

  const maxTime = Object.values(file.animations).reduce(
    (max, animation) => Math.max(max, getAnimationDuration(animation)),
    0
  );
  const animation = selectedAnimation
    ? file.animations[selectedAnimation]
    : null;

  const [timeline, setTimeline] = useState<number | null>(null);
  const { setTimestamp } = usePlayerControls();

  usePlayerTimestamp((timestamp) => {
    setTimeline(timestamp);
    if (selectedAnimation && timestamp !== null) {
      onStopAnimations?.([selectedAnimation]);
    }
  });

  const handleTimelineDrag = useCallback(
    (time: number) => {
      if (!selectedAnimation) return;

      if (animationsPlaying.includes(selectedAnimation)) {
        onStopAnimations?.([selectedAnimation]);
      }
      setTimestamp(time * 1000);
    },
    [selectedAnimation, animationsPlaying, onStopAnimations, setTimestamp]
  );

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
      onReorder={(animationId, fromIndex, toIndex) => {
        setFile((file) => {
          return reorderControlTrackInAnimation(
            animationId,
            fromIndex,
            toIndex
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
                onSelectAnimation?.(addDetails.id);
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
            <ToolButton
              disabled={animationsPlaying.length === 0}
              icon={<Icon colorize>⏹</Icon>}
              onClick={() => {
                onStopAnimations?.([...animationsPlaying]);
              }}
              tooltip="Stop all animations"
            />
            <ToolButton
              disabled={!Object.values(file.animations).some((a) => a.autoplay)}
              icon={<Icon colorize>▶</Icon>}
              onClick={() => {
                const autoPlayAnimations = Object.entries(file.animations)
                  .filter(([_, a]) => a.autoplay)
                  .map(([id]) => id);
                onStartAnimations?.(autoPlayAnimations);
                if (
                  selectedAnimation &&
                  autoPlayAnimations.includes(selectedAnimation)
                ) {
                  setTimestamp(null);
                }
              }}
              tooltip="Start all autoplay animations"
            />
          </ToolBar>
          <AnimationsContainer
            duration={(maxTime + EXTRA_TIME) / 1000}
            momentTimestamp={timeline !== null ? timeline / 1000 : 0}
            onTimelineDrag={handleTimelineDrag}
            onZoomChange={setZoom}
            showMomentMarker={timeline !== null}
            title="Timeline"
            zoom={zoom}
          >
            {(file.animationHierarchy.root?.children ?? []).map(
              (animationId) => (
                <AnimationTimeline
                  animationId={animationId}
                  isPlaying={animationsPlaying.includes(animationId)}
                  key={animationId}
                  onDelete={() => {
                    setFile(deleteAnimation(animationId));
                    onFrameSelect?.(null);
                  }}
                  onFrameSelect={onFrameSelect}
                  onPlay={() => {
                    onStartAnimations?.([animationId]);
                    if (animationId === selectedAnimation) {
                      setTimestamp(null);
                    }
                  }}
                  onSelect={() => {
                    onSelectAnimation?.(animationId);
                    if (!animationsPlaying.includes(animationId)) {
                      setTimestamp(0);
                    } else {
                      setTimestamp(null);
                    }
                    if (animationId !== selectedFrame?.animationId) {
                      onFrameSelect?.(null);
                    }
                  }}
                  onStop={() => {
                    onStopAnimations?.([animationId]);
                  }}
                  selected={selectedAnimation === animationId}
                  selectedTimeBar={
                    selectedAnimation === animationId ? selectedFrame : null
                  }
                />
              )
            )}
          </AnimationsContainer>
        </Panel>
      </ZoomContext.Provider>
    </TrackDragProvider>
  );
};
