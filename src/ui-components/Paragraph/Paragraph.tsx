import { PropsWithChildren } from "react";
import { className } from "../className";
import { ToolBarSize } from "../ToolBar/ToolBar";
// import styles from "./Paragraph.module.css";

type LabelProps = PropsWithChildren<{
  size?: ToolBarSize;
  selectable?: boolean;
}>;

/**
 * Used for displaying a paragraph of text. By default, this text is selectable by the user.
 */
export const Paragraph: React.FC<LabelProps> = ({
  children,
  size = "default",
  selectable = true,
}) => (
  <p
    className={className({
      ["font-caption py-1 text-zinc-800 dark:text-zinc-100"]: true,
      ["text-xs"]: size === "small",
      ["select-text"]: selectable,
    })}
  >
    {children}
  </p>
);
