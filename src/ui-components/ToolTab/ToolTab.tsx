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
      tooltip,
      onClick,
      onKeyDown: onKeydown,
    },
    ref
  ) => {
    const toolbarProps = useContext(ToolbarContext);
    const useSize = size === undefined ? toolbarProps.size : size ?? "default";
    return (
      <button
        type="button"
        className={className({
          [styles.toolTab]: true,
          [styles.active]: active,
          [styles.small]: useSize === "small",
        })}
        onClick={onClick}
        onKeyDown={onKeydown}
        disabled={disabled}
        title={tooltip}
        ref={ref}
      >
        {icon}{" "}
        {label && (
          <Label active={active} size={useSize}>
            {label}
          </Label>
        )}
      </button>
    );
  }
);

ToolTab.displayName = "ToolTab";
