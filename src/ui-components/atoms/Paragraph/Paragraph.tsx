import { FC, PropsWithChildren } from "react";
import { ToolBarSize } from "../../ToolBar/ToolBar";
import clsx from "clsx";

type LabelProps = PropsWithChildren<{
  size?: ToolBarSize;
  selectable?: boolean;
}>;

/**
 * Used for displaying a paragraph of text. By default, this text is selectable by the user.
 */
export const Paragraph: FC<LabelProps> = ({
  children,
  size = "default",
  selectable = true,
}) => (
  <p
    className={clsx("font-caption py-1 text-text", {
      "text-xs": size === "small",
      "select-text": selectable,
    })}
  >
    {children}
  </p>
);
