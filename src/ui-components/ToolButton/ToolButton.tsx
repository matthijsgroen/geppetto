import {
  forwardRef,
  useContext,
  MouseEventHandler,
  KeyboardEventHandler,
} from "react";
import { Label } from "../Label/Label";
import { ToolbarContext } from "../ToolBar/ToolBarContext";
import styles from "./ToolButton.module.css";
import { className } from "../className";

type ToolButtonProps = {
  icon?: React.ReactChild;
  label?: string;
  active?: boolean;
  disabled?: boolean;
  tooltip?: string;
  notificationBadge?: boolean;
  size?: "default" | "small";
  onClick?: MouseEventHandler<HTMLButtonElement>;
  onKeyDown?: KeyboardEventHandler<HTMLButtonElement>;
};

export const ToolButton = forwardRef<HTMLButtonElement, ToolButtonProps>(
  (
    {
      icon,
      active = false,
      notificationBadge = false,
      size,
      disabled,
      tooltip,
      label,
      onClick,
      onKeyDown,
    },
    ref
  ) => {
    const toolbarSize = useContext(ToolbarContext);
    const useSize = size === undefined ? toolbarSize : size ?? "default";
    return (
      <button
        type={"button"}
        onClick={onClick}
        onKeyDown={onKeyDown}
        className={className({
          [styles.toolbutton]: true,
          [styles.active]: active,
          [styles.small]: useSize === "small",
          [styles.notificationBadge]: notificationBadge,
        })}
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
ToolButton.displayName = "ToolButton";
