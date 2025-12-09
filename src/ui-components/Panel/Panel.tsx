import clsx from "clsx";
import { PropsWithChildren } from "react";

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
export const Panel: React.FC<PanelProps> = ({
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
      "bg-neutral-400 dark:bg-zinc-800": workspace,
      "bg-gray-200 dark:bg-neutral-700": !workspace,
      border: true,
      "border-transparent": !workspace,
      "border-zinc-800/20": workspace,
      "text-zinc-800 dark:text-zinc-100": true,
      "flex flex-col overflow-hidden": true,
      "flex-1": !fitContent,
      "flex-[0_0_fit-content]": fitContent,
      "items-center justify-center": center,
    })}
  >
    {children}
  </div>
);
