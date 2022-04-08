import { className } from "../className";
import styles from "./Label.module.css";

type LabelProps = {
  active?: boolean;
  size?: "default" | "small";
};

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
