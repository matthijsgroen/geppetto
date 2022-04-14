import { PropsWithChildren } from "react";
import styles from "./Column.module.css";

export const Column: React.FC<PropsWithChildren<{}>> = ({ children }) => (
  <div className={styles.column}>{children}</div>
);
