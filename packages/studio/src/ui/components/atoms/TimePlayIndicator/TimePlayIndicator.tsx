import clsx from "clsx";
import type { CSSProperties, FC } from "react";

export type TimePlayIndicatorProps = {
  playing?: boolean;
  loop?: boolean;
  duration: number;
  trackIndex?: number;
};

export const TimePlayIndicator: FC<TimePlayIndicatorProps> = ({
  playing = false,
  loop = false,
  trackIndex,
  duration,
}) => {
  return playing ? (
    <div
      className={clsx("absolute top-0 z-10 mx-2", {
        "play-indicator-(--length)/infinite": loop,
        "play-indicator-(--length)/once": !loop,
        "h-6": trackIndex === undefined,
        "h-5": trackIndex !== undefined,
      })}
      style={
        {
          top:
            trackIndex === undefined
              ? 0
              : `calc(${6 + trackIndex * 5} * var(--spacing))`,
          "--length": `${duration}`,
        } as CSSProperties
      }
    ></div>
  ) : null;
};
