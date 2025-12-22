import { clsx } from "clsx";
import { type FC, type PropsWithChildren } from "react";

import { type ToolBarSize } from "../../molecules/ToolBar/ToolBar";

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
export const Label: FC<LabelProps> = ({
  children,
  htmlFor,
  active = false,
  size = "default",
  selectable = false,
  vertical = false,
}) => (
  <label
    className={clsx({
      ["py-1 font-caption"]: true,
      ["text-text"]: !active,
      ["text-active"]: active,
      ["text-xs"]: size === "small",
      ["text-vertical"]: vertical,
      ["select-text"]: selectable,
    })}
    htmlFor={htmlFor}
  >
    {children}
  </label>
);
