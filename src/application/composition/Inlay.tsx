import { PropsWithChildren } from "react";
import styles from "./Inlay.module.css";

export const Inlay: React.FC<PropsWithChildren<{}>> = ({ children }) => (
  <div className={styles.inlay}>{children}</div>
);
