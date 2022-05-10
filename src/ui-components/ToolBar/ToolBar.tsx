import React, { PropsWithChildren } from "react";
import { ToolbarContext } from "./ToolBarContext";
import styles from "./ToolBar.module.css";
import { className } from "../className";

export type ToolBarSize = "default" | "small";

type ToolBarProps = PropsWithChildren<{
  size?: ToolBarSize;
  vertical?: boolean;
}>;

export const ToolBar: React.FC<ToolBarProps> = ({
  children,
  size = "default",
  vertical = false,
}) => (
  <ToolbarContext.Provider value={{ size, vertical }}>
    <div
      className={className({
        [styles.outer]: true,
        [styles.horizontal]: !vertical,
        [styles.vertical]: vertical,
        [styles.small]: size === "small",
      })}
    >
      <div
        className={className({
          [styles.inner]: true,
          [styles.horizontal]: !vertical,
          [styles.vertical]: vertical,
          [styles.small]: size === "small",
        })}
      >
        {children}
      </div>
    </div>
  </ToolbarContext.Provider>
);
ToolBar.displayName = "ToolBar";
