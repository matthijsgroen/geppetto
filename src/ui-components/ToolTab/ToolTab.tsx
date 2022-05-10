import { forwardRef, useContext } from "react";
import styles from "./ToolTab.module.css";
import { className } from "../className";
import { Label } from "../Label/Label";
import { ToolBarSize } from "../ToolBar/ToolBar";
import { ToolbarContext } from "../ToolBar/ToolBarContext";

type ToolTabProps = {
  label?: React.ReactChild;
  icon?: React.ReactChild;
  active?: boolean;
  disabled?: boolean;
  size?: ToolBarSize;
  vertical?: boolean;
  tooltip?: string;
  onClick?: () => void;
  onKeyDown?: () => void;
};

export const ToolTab = forwardRef<HTMLButtonElement, ToolTabProps>(
  (
    {
      icon,
      label,
      disabled,
      active = false,
      size,
      vertical,
      tooltip,
      onClick,
      onKeyDown: onKeydown,
    },
    ref
  ) => {
    const toolbarProps = useContext(ToolbarContext);
    const useSize = size === undefined ? toolbarProps.size : size ?? "default";
    const useVertical =
      vertical === undefined ? toolbarProps.vertical : vertical ?? false;
    return (
      <button
        type="button"
        className={className({
          [styles.toolTab]: true,
          [styles.active]: active,
          [styles.small]: useSize === "small",
          [styles.horizontal]: !useVertical,
          [styles.vertical]: useVertical,
        })}
        onClick={onClick}
        onKeyDown={onKeydown}
        disabled={disabled}
        title={tooltip}
        ref={ref}
      >
        {icon}{" "}
        {label && (
          <Label active={active} size={useSize} vertical={useVertical}>
            {label}
          </Label>
        )}
      </button>
    );
  }
);

ToolTab.displayName = "ToolTab";
