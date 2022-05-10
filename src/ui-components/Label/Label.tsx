import { PropsWithChildren } from "react";
import { className } from "../className";
import { ToolBarSize } from "../ToolBar/ToolBar";
import styles from "./Label.module.css";

type LabelProps = PropsWithChildren<{
  active?: boolean;
  size?: ToolBarSize;
  vertical?: boolean;
}>;

/**
 * Used for displaying labels on TabBars and Controls
 */
export const Label: React.FC<LabelProps> = ({
  children,
  active = false,
  size = "default",
  vertical = false,
}) => (
  <span
    className={className({
      [styles.label]: true,
      [styles.active]: active,
      [styles.small]: size === "small",
      [styles.vertical]: vertical,
    })}
  >
    {children}
  </span>
);
