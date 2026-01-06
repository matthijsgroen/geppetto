import type { FC } from "react";

import type {
  FrameControlAction,
  GeppettoImage,
} from "@/dtos/animation-file2.dto";
import {
  AnimationTrack,
  TimeBar,
  TimeLineEndHandle,
  TimePin,
} from "@/ui/components";

export const AnimationTimeline: FC<{
  animationId: string;
  file: GeppettoImage;
  onSelect: () => void;
  onFrameSelect?: (
    frame: FrameControlAction,
    animationId: string,
    actionIndex: number
  ) => void;
  selected: boolean;
}> = ({ animationId, file, onSelect, onFrameSelect, selected }) => {
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
    <AnimationTrack
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
    </AnimationTrack>
  );
};
