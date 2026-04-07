import clsx from "clsx";
import type { CSSProperties, FC } from "react";

export type TimePlayIndicatorProps = {
  playing?: boolean;
  startedAt?: number;
  loop?: boolean;
  duration: number;
  trackIndex?: number;
  selected?: boolean;
};

export const TimePlayIndicator: FC<TimePlayIndicatorProps> = ({
  playing = false,
  startedAt = 0,
  loop = false,
  trackIndex,
  duration,
  selected = false,
}) => {
  return (
    <div
      className={clsx("absolute top-0 z-10 mx-2", {
        "play-indicator-(--length)/loop": loop && playing,
        "play-indicator-(--length)/once": !loop && playing,
        "h-6": trackIndex === undefined && selected,
        "bottom-0": trackIndex === undefined && !selected,
        "h-5": trackIndex !== undefined,
        "opacity-0": !selected && trackIndex !== undefined,
      })}
      style={
        {
          top:
            trackIndex === undefined
              ? 0
              : `calc(${6 + trackIndex * 5} * var(--spacing))`,
          "--length": `${duration}`,
          animationDelay: `-${startedAt}s`,
        } as CSSProperties
      }
    ></div>
  );
};
