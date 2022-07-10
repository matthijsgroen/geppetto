import { PropsWithChildren } from "react";
import styles from "./EmptyTree.module.css";

export const EmptyTree: React.FC<PropsWithChildren<{}>> = ({ children }) => (
  <div className={styles.emptyTree}>{children}</div>
);
