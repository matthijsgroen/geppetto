import type { FC } from "react";

import type {
  FrameControlAction,
  GeppettoImage,
} from "@/dtos/animation-file2.dto";
import { AnimationTrack, TimeBar, TimePin } from "@/ui/components";

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

  return (
    <AnimationTrack
      key={animationId}
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
