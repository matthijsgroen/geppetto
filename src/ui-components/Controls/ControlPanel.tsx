import { PropsWithChildren } from "react";
import styles from "./ControlPanel.module.css";

type ControlPanelProps = PropsWithChildren<{}>;

export const ControlPanel: React.FC<ControlPanelProps> = ({ children }) => (
  <form className={styles.controlPanel}>{children}</form>
);
