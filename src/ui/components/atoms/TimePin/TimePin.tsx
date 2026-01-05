import clsx from "clsx";
import { type FC, use } from "react";

import { AnimationTrackContext } from "@/ui/components/molecules/AnimationTrack/AnimationTrackContext";

/** In Seconds */
export type TimeStamp = number;

export const TimePin: FC<{
  location: TimeStamp;
  activeTrack?: boolean;
  label?: string;
}> = ({ location, activeTrack, label }) => {
  const containerProps = use(AnimationTrackContext);
  const isActiveTrack = activeTrack ?? containerProps.activeTrack;
  return (
    <div
      aria-label={`${label ? label + " " : ""}${location}s`}
      className="absolute top-0.5 bottom-0.5 z-20 w-0 border-x border-dashed border-control-interaction"
      style={{ left: `${location}em` }}
    >
      <div
        className={clsx(
          "cursor-grab rounded-full border border-control-edge bg-control-interaction hover:bg-control-highlight",
          !isActiveTrack && "-ms-1 size-2",
          isActiveTrack && "-ms-2 size-4"
        )}
        title={`${label ? label + " " : ""}${location}s`}
      ></div>
    </div>
  );
};
