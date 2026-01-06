import type { FC } from "react";

import {
  isFrameControlAction,
  isFrameEvent,
} from "@/domain/animation/file2/animations";
import type {
  FrameControlAction,
  GeppettoImage,
} from "@/dtos/animation-file2.dto";
import { AnimationTrack, TimePin } from "@/ui/components";
import { TimeBar } from "@/ui/components/atoms/TimeBar/TimeBar";

const getControlNames = (
  file: GeppettoImage,
  animationId: string
): string[] => {
  const controlIds = getControlIds(file, animationId);
  return controlIds.map((controlId) => file.controls[controlId]?.name || "");
};

const getControlIds = (file: GeppettoImage, animationId: string): string[] => {
  const animation = file.animations[animationId];
  return animation.actions
    .filter(isFrameControlAction)
    .map((a) => a.controlId)
    .filter((v, i, a) => a.indexOf(v) === i);
};

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
  const controlIds = getControlIds(file, animationId);

  return (
    <AnimationTrack
      controlNames={getControlNames(file, animationId)}
      key={animationId}
      name={animation.name}
      onSelect={onSelect}
      selected={selected}
    >
      {animation.actions
        .filter((a) => isFrameControlAction(a))
        .map((action, actionIndex) => (
          <TimeBar
            duration={action.duration / 1000}
            easing={action.easingFunction}
            key={actionIndex}
            start={action.start / 1000}
            trackIndex={controlIds.indexOf(action.controlId)}
          />
        ))}
      {animation.actions
        .filter((a) => isFrameEvent(a))
        .map((action, actionIndex) => (
          <TimePin
            key={actionIndex}
            label={action.event}
            location={action.start / 1000}
          />
        ))}
    </AnimationTrack>
  );
};
