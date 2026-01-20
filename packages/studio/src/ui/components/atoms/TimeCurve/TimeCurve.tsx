import type { EasingFunction } from "@geppetto/types";
import clsx from "clsx";
import type { FC } from "react";

export const TimeCurve: FC<{
  size?: "flex" | "option";
  variant: EasingFunction;
  start?: number;
  end?: number;
}> = ({ variant, size = "flex", start = 0, end = 1 }) => {
  const offsetTop = 1 - Math.max(start, end);
  const offsetBottom = Math.min(start, end);

  return (
    <div
      className={clsx(
        "pointer-events-none flex-col gap-0",
        size === "flex" && "flex h-full flex-1",
        size === "option" && "me-1 inline-flex h-4 w-8"
      )}
    >
      <div style={{ height: `${offsetTop * 100}%` }}></div>
      <div
        className={clsx(
          "pointer-events-none flex flex-1 bg-control-focus/50",
          start > end && "scale-x-[-1]",
          variant === "linear" && "clip-linear",
          variant === "easeIn" && "clip-ease-in",
          variant === "easeOut" && "clip-ease-out",
          variant === "easeInOut" && "clip-ease-in-out"
        )}
      ></div>
      <div
        className="bg-control-focus/50"
        style={{ height: `${offsetBottom * 100}%` }}
      ></div>
    </div>
  );
};
