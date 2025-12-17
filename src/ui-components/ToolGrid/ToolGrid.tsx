import { type FC, type PropsWithChildren } from "react";

import { type ToolBarSize } from "../molecules/ToolBar/ToolBar";
import { ToolbarContext } from "../molecules/ToolBar/ToolBarContext";
import styles from "./ToolGrid.module.css";

type ToolBarProps = PropsWithChildren<{
  size?: ToolBarSize;
}>;

export const ToolGrid: FC<ToolBarProps> = ({ children, size = "default" }) => (
  <ToolbarContext.Provider value={{ size, vertical: false }}>
    <div className={styles.toolGrid}>{children}</div>
  </ToolbarContext.Provider>
);
