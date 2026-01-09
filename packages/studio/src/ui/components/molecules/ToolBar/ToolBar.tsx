import clsx from "clsx";
import { type FC, type PropsWithChildren } from "react";

import { ToolbarContext } from "./ToolBarContext";

export type ToolBarSize = "default" | "small" | "minimal";

type ToolBarProps = PropsWithChildren<{
  size?: ToolBarSize;
  vertical?: boolean;
  transparent?: boolean;
}>;

export const ToolBar: FC<ToolBarProps> = ({
  children,
  size = "default",
  vertical = false,
  transparent = false,
}) => (
  <ToolbarContext.Provider value={{ size, vertical }}>
    <div
      className={clsx(
        "hide-scrollbar shrink-0",
        !transparent && "bg-toolbar",
        vertical
          ? "overflow-x-visible overflow-y-scroll"
          : "overflow-x-scroll overflow-y-visible",
        !vertical && size === "default" && "h-12",
        vertical && size === "default" && "w-12",
        !vertical && size === "small" && "h-9",
        vertical && size === "small" && "w-9",
        !vertical && size === "minimal" && "h-7",
        vertical && size === "minimal" && "w-7"
      )}
    >
      <div
        className={clsx(
          "flex flex-0 items-center",
          vertical
            ? "min-h-fit flex-col [&_>_*+*]:mt-1"
            : "min-w-fit flex-row [&_>_*+*]:ml-1",
          !vertical && size === "default" && "h-12 px-1",
          vertical && size === "default" && "w-12 py-1.5",
          !vertical && size === "small" && "h-9 px-1",
          vertical && size === "small" && "w-9 py-1.5",
          !vertical && size === "minimal" && "h-7 px-0.5",
          vertical && size === "minimal" && "w-7 py-0.5"
        )}
      >
        {children}
      </div>
    </div>
  </ToolbarContext.Provider>
);
