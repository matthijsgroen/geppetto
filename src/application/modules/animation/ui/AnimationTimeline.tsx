import type { FC } from "react";

import type {
  FrameControlAction,
  GeppettoImage,
} from "@/dtos/animation-file2.dto";
import { AnimationTrack, TimePin } from "@/ui/components";

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

  return (
    <AnimationTrack
      controlNames={[]}
      key={animationId}
      name={animation.name}
      onSelect={onSelect}
      selected={selected}
    ></AnimationTrack>
  );
};
