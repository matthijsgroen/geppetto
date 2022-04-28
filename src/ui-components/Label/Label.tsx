import { PropsWithChildren } from "react";
import { className } from "../className";
import styles from "./Label.module.css";

type LabelProps = PropsWithChildren<{
  active?: boolean;
  size?: "default" | "small";
}>;

/**
 * Used for displaying labels on TabBars and Controls
 */
export const Label: React.FC<LabelProps> = ({
  children,
  active = false,
  size = "default",
}) => (
  <span
    className={className({
      [styles.label]: true,
      [styles.active]: active,
      [styles.small]: size === "small",
    })}
  >
    {children}
  </span>
);
