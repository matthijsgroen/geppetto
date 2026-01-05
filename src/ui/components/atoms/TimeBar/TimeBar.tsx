import clsx from "clsx";
import { type FC, use } from "react";

import type { EasingFunction } from "@/dtos/animation-file2.dto";
import { TimeCurve } from "@/ui/components/atoms/TimeCurve/TimeCurve";
import { AnimationTrackContext } from "@/ui/components/molecules/AnimationTrack/AnimationTrackContext";

import { TimeStretchHandle } from "./TimeStretchHandle";

export const TimeBar: FC<{
  start: number;
  duration: number;
  selected?: boolean;
  trackIndex: number;
  easing?: EasingFunction;
  variant?: "mini" | "default";
}> = ({ start, duration, selected = false, trackIndex, easing, variant }) => {
  const containerProps = use(AnimationTrackContext);
  const activeVariant =
    variant ?? (containerProps.activeTrack ? "default" : "mini");
  return (
    <div
      className={clsx(
        "absolute z-10 flex cursor-pointer items-center justify-between gap-0.5 rounded-control-small border hover:bg-control-highlight",
        activeVariant === "default" && "h-5 shadow-sm",
        activeVariant === "mini" && "h-0.5",
        selected && "border-control-focus bg-control-active",
        !selected && "border-control-edge bg-toolbar"
      )}
      style={{
        left: `${start}em`,
        width: `${duration}em`,
        top:
          activeVariant === "default"
            ? `calc(${(trackIndex + 1) * 5} * var(--spacing))`
            : `calc(${4 + trackIndex * 0.5} * var(--spacing))`,
      }}
    >
      {activeVariant === "default" && (
        <>
          <TimeStretchHandle />
          {easing && <TimeCurve variant={easing} />}
          <TimeStretchHandle />
        </>
      )}
    </div>
  );
};
