import { PropsWithChildren } from "react";
import { className } from "../className";
import { ToolBarSize } from "../ToolBar/ToolBar";
import styles from "./Label.module.css";

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
      [styles.label]: true,
      [styles.active]: active,
      [styles.small]: size === "small",
      [styles.vertical]: vertical,
      [styles.selectable]: selectable,
    })}
    htmlFor={htmlFor}
  >
    {children}
  </label>
);
