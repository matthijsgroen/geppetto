import clsx from "clsx";
import { type FC, use } from "react";

import { ToolbarContext } from "@/ui/components/molecules/ToolBar/ToolBarContext";

/**
 * Creates a small dividing line between toolbar elements
 */
export const ToolSeparator: FC = () => {
  const toolbarProps = use(ToolbarContext);
  return (
    <span
      className={clsx("inline-block border-control-edge text-[0px]", {
        "border-r": !toolbarProps.vertical,
        "h-7": !toolbarProps.vertical && toolbarProps.size !== "minimal",
        "h-5": !toolbarProps.vertical && toolbarProps.size === "minimal",
        "border-b pt-0.5": toolbarProps.vertical,
        "w-7": toolbarProps.vertical && toolbarProps.size !== "minimal",
        "w-5": toolbarProps.vertical && toolbarProps.size === "minimal",
      })}
    >
      |
    </span>
  );
};
