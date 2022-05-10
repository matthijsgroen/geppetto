import { useContext } from "react";
import { className } from "../className";
import { ToolbarContext } from "../ToolBar/ToolBarContext";
import styles from "./ToolSeparator.module.css";

/**
 * Creates a small dividing line between toolbar elements
 */
export const ToolSeparator: React.FC = () => {
  const toolbarProps = useContext(ToolbarContext);
  return (
    <span
      className={className({
        [styles.separator]: true,
        [styles.horizontal]: !toolbarProps.vertical,
        [styles.vertical]: toolbarProps.vertical,
      })}
    >
      |
    </span>
  );
};
ToolSeparator.displayName = "ToolSeparator";
