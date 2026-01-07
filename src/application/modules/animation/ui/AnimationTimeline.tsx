import type { FC } from "react";

import type {
  AnimationControlTrack,
  AnimationVisibilityTrack,
  FrameControlAction,
  FrameLayerVisibilityAction,
  GeppettoImage,
} from "@/dtos/animation-file2.dto";
import {
  AnimationTrack as AnimationTrackComponent,
  TimeBar,
  TimeLineEndHandle,
  TimePin,
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

export const AnimationTimeline: FC<{
  animationId: string;
  file: GeppettoImage;
  onSelect: () => void;
  onFrameSelect?: (frame: AnimationFrame) => void;
  selected: boolean;
  selectedTimeBar?: AnimationFrame | null;
}> = ({
  animationId,
  file,
  onSelect,
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

  return (
    <AnimationTrackComponent
      key={animationId}
      length={animationLength / 1000}
      loop={animation.looping}
      name={animation.name}
      onSelect={onSelect}
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
