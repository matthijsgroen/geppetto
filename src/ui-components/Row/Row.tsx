import { PropsWithChildren } from "react";
import styles from "./Row.module.css";

export const Row: React.FC<PropsWithChildren<{}>> = ({ children }) => (
  <div className={styles.row}>{children}</div>
);
