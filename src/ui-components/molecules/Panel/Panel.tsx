import clsx from "clsx";
import { type FC, type PropsWithChildren } from "react";

type PanelProps = PropsWithChildren<{
  padding?: "sm" | "md";
  workspace?: boolean;
  center?: boolean;
  fitContent?: boolean;
}>;

/**
 * Basic component that applies the proper theme color as background,
 * supports padding and supports centralizing elements.
 */
export const Panel: FC<PanelProps> = ({
  children,
  padding,
  workspace = false,
  center = false,
  fitContent = false,
}) => (
  <div
    className={clsx({
      "p-1": padding === "sm",
      "p-2": padding === "md",
      "bg-workspace": workspace,
      "bg-panel": !workspace,
      border: true,
      "border-transparent": !workspace,
      "border-control-edge": workspace,
      "text-text": true,
      "flex flex-col overflow-hidden": true,
      "flex-1": !fitContent,
      "flex-[0_0_fit-content]": fitContent,
      "items-center justify-center": center,
    })}
  >
    {children}
  </div>
);
