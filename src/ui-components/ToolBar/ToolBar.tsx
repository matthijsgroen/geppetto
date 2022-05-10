import React, { PropsWithChildren } from "react";
import { ToolbarContext } from "./ToolBarContext";
import styles from "./ToolBar.module.css";
import { className } from "../className";

export type ToolBarSize = "default" | "small";

type ToolBarProps = PropsWithChildren<{
  size?: ToolBarSize;
}>;

export const ToolBar: React.FC<ToolBarProps> = ({
  children,
  size = "default",
}) => (
  <ToolbarContext.Provider value={size}>
    <div
      className={className({
        [styles.outer]: true,
        [styles.small]: size === "small",
      })}
    >
      <div
        className={className({
          [styles.inner]: true,
          [styles.small]: size === "small",
        })}
      >
        {children}
      </div>
    </div>
  </ToolbarContext.Provider>
);
ToolBar.displayName = "ToolBar";
