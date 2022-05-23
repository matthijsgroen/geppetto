import { PropsWithChildren } from "react";
import { Label } from "../Label/Label";
import styles from "./Control.module.scss";

type ControlProps = PropsWithChildren<{
  htmlFor?: string;
  label?: string;
}>;

export const Control: React.FC<ControlProps> = ({
  label,
  htmlFor,
  children,
}) => (
  <div className={styles.control}>
    {label && (
      <div className={styles.labelElement}>
        <Label htmlFor={htmlFor}>{label}</Label>
      </div>
    )}
    <div className={styles.controlInput}>{children}</div>
  </div>
);
Control.displayName = "Control";
