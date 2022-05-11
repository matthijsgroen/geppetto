import { PropsWithChildren } from "react";
import { className } from "../className";
import styles from "./ControlPanel.module.css";

type ControlPanelProps = PropsWithChildren<{ shadow?: boolean }>;

export const ControlPanel: React.FC<ControlPanelProps> = ({
  children,
  shadow = false,
}) => (
  <form
    className={className({
      [styles.controlPanel]: true,
      [styles.shadow]: shadow,
    })}
  >
    {children}
  </form>
);
