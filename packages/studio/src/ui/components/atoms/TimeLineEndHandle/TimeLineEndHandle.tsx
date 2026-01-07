import { type FC, use } from "react";

import { TimeStretchHandle } from "@/ui/components/atoms/TimeBar/TimeStretchHandle";
import type { TimeStamp } from "@/ui/components/atoms/TimePin/TimePin";
import { AnimationTrackContext } from "@/ui/components/molecules/AnimationTrack/AnimationTrackContext";

export const TimeLineEndHandle: FC<{
  location: TimeStamp;
  loop?: boolean;
  trackIndex?: number;
}> = ({ location, loop = false, trackIndex = 0 }) => {
  const containerProps = use(AnimationTrackContext);
  if (!containerProps.activeTrack) {
    return null;
  }
  return (
    <div
      className="absolute left-0 flex h-6"
      style={{
        top: `calc(${6 + trackIndex * 5} * var(--spacing))`,
      }}
    >
      <div
        className="box-content flex h-full bg-panel ps-2"
        style={{
          width: `${location}em`,
        }}
      ></div>
      <div className="flex h-full w-2 items-center justify-end rounded-e-sm bg-panel">
        <TimeStretchHandle />
      </div>
      {loop && <div className="px-2 text-sm text-dimmed">⏎</div>}
    </div>
  );
};
