import React from "react";
import styles from "./ToolSpacer.module.css";

/**
 * Pushes controls to the right, allowing tools on the right side of the toolbar
 */
export const ToolSpacer: React.FC = () => <span className={styles.spacer} />;
ToolSpacer.displayName = "ToolSpacer";
