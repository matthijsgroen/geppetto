import { type FC, type PropsWithChildren } from "react";

import styles from "./Inlay.module.css";

export const Inlay: FC<PropsWithChildren> = ({ children }) => (
  <div className={styles.inlay}>{children}</div>
);
