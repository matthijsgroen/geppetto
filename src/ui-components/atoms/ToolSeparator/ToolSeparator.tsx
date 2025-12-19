import clsx from "clsx";
import { type FC, use } from "react";

import { ToolbarContext } from "../../molecules/ToolBar/ToolBarContext";

/**
 * Creates a small dividing line between toolbar elements
 */
export const ToolSeparator: FC = () => {
  const toolbarProps = use(ToolbarContext);
  return (
    <span
      className={clsx("inline-block border-control-edge text-[0px]", {
        "h-7 border-r": !toolbarProps.vertical,
        "w-7 border-b pt-0.5": toolbarProps.vertical,
      })}
    >
      |
    </span>
  );
};
