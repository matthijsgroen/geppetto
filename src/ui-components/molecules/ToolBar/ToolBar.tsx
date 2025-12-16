import { FC, PropsWithChildren } from "react";
import { ToolbarContext } from "./ToolBarContext";
import clsx from "clsx";

export type ToolBarSize = "default" | "small";

type ToolBarProps = PropsWithChildren<{
  size?: ToolBarSize;
  vertical?: boolean;
}>;

export const ToolBar: FC<ToolBarProps> = ({
  children,
  size = "default",
  vertical = false,
}) => (
  <ToolbarContext.Provider value={{ size, vertical }}>
    <div
      className={clsx("hide-scrollbar shrink-0 bg-panel", {
        "overflow-x-scroll overflow-y-visible": !vertical,
        "overflow-x-visible overflow-y-scroll": vertical,
        "h-12": size === "default" && !vertical,
        "w-12": size === "default" && vertical,
        "h-9": size === "small" && !vertical,
        "w-9": size === "small" && vertical,
      })}
    >
      <div
        className={clsx("flex-0 flex items-center", {
          "flex-row min-w-fit px-1 [&_>_*+*]:ml-1": !vertical,
          "flex-col min-h-fit py-1.5 [&_>_*+*]:mt-1": vertical,
          "h-12": size === "default" && !vertical,
          "w-12": size === "default" && vertical,
          "h-9": size === "small" && !vertical,
          "w-9": size === "small" && vertical,
        })}
      >
        {children}
      </div>
    </div>
  </ToolbarContext.Provider>
);
