import { FC, use } from "react";
import { ToolbarContext } from "../../molecules/ToolBar/ToolBarContext";
import clsx from "clsx";

/**
 * Creates a small dividing line between toolbar elements
 */
export const ToolSeparator: FC = () => {
  const toolbarProps = use(ToolbarContext);
  return (
    <span
      className={clsx("inline-block text-[0px] border-control-edge", {
        "h-7 border-r": !toolbarProps.vertical,
        "w-7 border-b pt-0.5": toolbarProps.vertical,
      })}
    >
      |
    </span>
  );
};
