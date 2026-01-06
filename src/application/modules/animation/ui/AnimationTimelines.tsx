import { type FC, useState } from "react";

import { useFile } from "@/application/state/FileContext";
import { AnimationsContainer } from "@/ui/components";

import { AnimationTimeline } from "./AnimationTimeline";

export const AnimationTimelines: FC<{ zoom?: number }> = ({ zoom = 2 }) => {
  const [file, setFile] = useFile();
  const [selectedAnimation, setSelectedAnimation] = useState<string | null>(
    null
  );

  return (
    <AnimationsContainer duration={60} title="Timeline" zoom={zoom}>
      {Object.keys(file.animations).map((animationId) => (
        <AnimationTimeline
          animationId={animationId}
          file={file}
          key={animationId}
          onSelect={() => setSelectedAnimation(animationId)}
          selected={selectedAnimation === animationId}
        />
      ))}
    </AnimationsContainer>
  );
};
