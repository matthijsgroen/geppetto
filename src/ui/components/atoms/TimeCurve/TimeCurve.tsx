import clsx from "clsx";
import type { FC } from "react";

import type { EasingFunction } from "@/dtos/animation-file2.dto";

export const TimeCurve: FC<{
  size?: "flex" | "option";
  variant: EasingFunction;
}> = ({ variant, size = "flex" }) => {
  return (
    <div
      className={clsx(
        "bg-control-focus/50",
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
