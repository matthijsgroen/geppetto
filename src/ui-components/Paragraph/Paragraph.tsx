import { PropsWithChildren } from "react";
import { className } from "../className";
import { ToolBarSize } from "../ToolBar/ToolBar";
import styles from "./Paragraph.module.css";

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
      [styles.paragraph]: true,
      [styles.small]: size === "small",
      [styles.selectable]: selectable,
    })}
  >
    {children}
  </p>
);
