import type { EasingFunction } from "@geppetto/types";
import clsx from "clsx";
import { type FC, use } from "react";

import { TimeCurve } from "@/ui/components/atoms/TimeCurve/TimeCurve";
import type { TimeStamp } from "@/ui/components/atoms/TimePin/TimePin";
import { AnimationTrackContext } from "@/ui/components/molecules/AnimationTrack/AnimationTrackContext";

import { TimeStretchHandle } from "./TimeStretchHandle";

type TimeBarProps = {
  start: TimeStamp;
  duration: TimeStamp;
  selected?: boolean;
  trackIndex: number;
  easing?: EasingFunction;
  variant?: "mini" | "default";
  zoom?: number;
  onClick?: () => void;
  onEndDrag?: (newTime: TimeStamp) => void;
  onEndDragRelease?: (newTime: TimeStamp) => void;
  onStartDrag?: (newTime: TimeStamp) => void;
  onStartDragRelease?: (newTime: TimeStamp) => void;
};

export const TimeBar: FC<TimeBarProps> = ({
  start,
  duration,
  selected = false,
  trackIndex,
  easing,
  zoom = 1,
  variant,
  onClick,
  onEndDrag,
  onEndDragRelease,
  onStartDrag,
  onStartDragRelease,
}) => {
  const containerProps = use(AnimationTrackContext);
  const activeVariant =
    variant ?? (containerProps.activeTrack ? "default" : "mini");

  const Element = activeVariant === "default" ? "button" : "div";

  return (
    <Element
      className={clsx(
        "absolute z-10 flex items-center justify-between gap-0.5 rounded-control-small border",
        activeVariant === "default" &&
          "h-5 cursor-pointer shadow-sm hover:bg-control-highlight focus:z-20 focus:outline-2 focus:outline-control-focus",
        activeVariant === "mini" && "h-0.5",
        selected && "border-control-focus bg-control-active",
        !selected && "border-control-edge bg-toolbar"
      )}
      onClick={activeVariant === "default" ? onClick : undefined}
      role={activeVariant === "default" ? "button" : "presentation"}
      style={{
        left: `calc(${start}em + 2 * var(--spacing))`,
        width: `${duration}em`,
        top:
          activeVariant === "default"
            ? `calc(${6 + trackIndex * 5} * var(--spacing))`
            : `calc(${4 + trackIndex * 0.5} * var(--spacing))`,
      }}
    >
      {activeVariant === "default" && (
        <>
          <TimeStretchHandle
            location={start}
            onDrag={onStartDrag}
            onDragRelease={onStartDragRelease}
            zoom={zoom}
          />
          {easing && <TimeCurve variant={easing} />}
          <TimeStretchHandle
            location={start + duration}
            onDrag={onEndDrag}
            onDragRelease={onEndDragRelease}
            zoom={zoom}
          />
        </>
      )}
    </Element>
  );
};
