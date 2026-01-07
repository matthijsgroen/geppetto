import clsx from "clsx";
import { type FC, type PropsWithChildren } from "react";

import { type ToolBarSize } from "@/ui/components/molecules/ToolBar/ToolBar";

type LabelProps = PropsWithChildren<{
  size?: ToolBarSize;
  selectable?: boolean;
  align?: "left" | "center" | "right";
}>;

/**
 * Used for displaying a paragraph of text. By default, this text is selectable by the user.
 */
export const Paragraph: FC<LabelProps> = ({
  children,
  size = "default",
  selectable = true,
  align = "left",
}) => (
  <p
    className={clsx("py-2 text-text font-caption", {
      "text-xs": size === "small",
      "text-base/relaxed": size === "default",
      "select-text": selectable,
      "text-right": align === "right",
      "text-center": align === "center",
    })}
  >
    {children}
  </p>
);
