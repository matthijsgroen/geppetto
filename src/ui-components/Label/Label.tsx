import { PropsWithChildren } from "react";
import { className } from "../className";
import { ToolBarSize } from "../ToolBar/ToolBar";

type LabelProps = PropsWithChildren<{
  active?: boolean;
  size?: ToolBarSize;
  vertical?: boolean;
  selectable?: boolean;
  htmlFor?: string;
}>;

/**
 * Used for displaying labels on TabBars and Controls
 */
export const Label: React.FC<LabelProps> = ({
  children,
  htmlFor,
  active = false,
  size = "default",
  selectable = false,
  vertical = false,
}) => (
  <label
    className={className({
      ["font-caption py-1"]: true,
      ["text-zinc-800 dark:text-zinc-100"]: !active,
      ["text-slate-500 dark:text-green-500"]: active,
      ["text-xs"]: size === "small",
      ["text-vertical"]: vertical,
      ["select-text"]: selectable,
    })}
    htmlFor={htmlFor}
  >
    {children}
  </label>
);
