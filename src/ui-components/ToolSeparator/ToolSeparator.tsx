import { use } from "react";
import { ToolbarContext } from "../ToolBar/ToolBarContext";
import clsx from "clsx";

/**
 * Creates a small dividing line between toolbar elements
 */
export const ToolSeparator: React.FC = () => {
  const toolbarProps = use(ToolbarContext);
  return (
    <span
      className={clsx(
        "inline-block text-[0px] border-control-edge-light/20 dark:border-control-edge-dark/30",
        {
          "h-7 border-r": !toolbarProps.vertical,
          "w-7 border-b pt-0.5": toolbarProps.vertical,
        }
      )}
    >
      |
    </span>
  );
};
ToolSeparator.displayName = "ToolSeparator";

// .separator {
//   display: inline-block;
//   font-size: 0;
// }

// .separator.horizontal {
//   height: 1.8rem;
//   border-right: 1px solid var(--colors-control-edge);
// }
// .separator.vertical {
//   width: 1.8rem;
//   padding-top: 0.1rem;
//   border-bottom: 1px solid var(--colors-control-edge);
// }
