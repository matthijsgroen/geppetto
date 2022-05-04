import { PropsWithChildren } from "react";
import { Label } from "../Label/Label";
import styles from "./Control.module.scss";

type ControlProps = PropsWithChildren<{
  label?: string;
}>;

export const Control: React.FC<ControlProps> = ({ label, children }) => (
  <div className={styles.control}>
    {label && (
      <div className={styles.labelElement}>
        <Label>{label}</Label>
      </div>
    )}
    <div className={styles.controlInput}>{children}</div>
  </div>
);
Control.displayName = "Control";
