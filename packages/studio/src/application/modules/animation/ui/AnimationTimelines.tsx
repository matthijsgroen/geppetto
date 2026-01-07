import { type FC, useState } from "react";

import { useFile } from "@/application/state/FileContext";
import { AnimationsContainer } from "@/ui/components";

import type { AnimationFrame } from "./AnimationTimeline";
import { AnimationTimeline } from "./AnimationTimeline";

const EXTRA_TIME = 2000; // milliseconds

export const AnimationTimelines: FC<{
  zoom?: number;
  onFrameSelect?: (frame: AnimationFrame | null) => void;
  selectedFrame?: AnimationFrame | null;
}> = ({ zoom = 2, onFrameSelect, selectedFrame }) => {
  const [file] = useFile();
  const [selectedAnimation, setSelectedAnimation] = useState<string | null>(
    null
  );

  const maxTime = Object.values(file.animations).reduce((max, animation) => {
    const animationMax = Math.max(
      ...animation.tracks.map((track) => track.length),
      ...animation.events.map((event) => event.start)
    );
    return Math.max(max, animationMax);
  }, 0);

  return (
    <AnimationsContainer
      duration={(maxTime + EXTRA_TIME) / 1000}
      title="Timeline"
      zoom={zoom}
    >
      {Object.keys(file.animations).map((animationId) => (
        <AnimationTimeline
          animationId={animationId}
          file={file}
          key={animationId}
          onFrameSelect={onFrameSelect}
          onSelect={() => {
            setSelectedAnimation(animationId);
            if (animationId !== selectedFrame?.animationId) {
              onFrameSelect?.(null);
            }
          }}
          selected={selectedAnimation === animationId}
          selectedTimeBar={selectedFrame}
        />
      ))}
    </AnimationsContainer>
  );
};
