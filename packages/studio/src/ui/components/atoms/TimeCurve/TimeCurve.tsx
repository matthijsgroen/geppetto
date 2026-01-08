import type { EasingFunction } from "@geppetto/types";
import clsx from "clsx";
import type { FC } from "react";

export const TimeCurve: FC<{
  size?: "flex" | "option";
  variant: EasingFunction;
}> = ({ variant, size = "flex" }) => {
  return (
    <div
      className={clsx(
        "pointer-events-none bg-control-focus/50",
        size === "flex" && "h-full flex-1",
        size === "option" && "me-1 inline-block h-4 w-8",
        variant === "linear" && "clip-linear",
        variant === "easeIn" && "clip-ease-in",
        variant === "easeOut" && "clip-ease-out",
        variant === "easeInOut" && "clip-ease-in-out"
      )}
    ></div>
  );
};
