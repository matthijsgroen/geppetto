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
import { ToolBarSize } from "../ToolBar/ToolBar";

type ToolButtonProps = {
  icon?: React.ReactChild;
  label?: string;
  active?: boolean;
  shadow?: boolean;
  disabled?: boolean;
  tooltip?: string;
  notificationBadge?: boolean;
  size?: ToolBarSize;
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
      shadow = false,
      disabled,
      tooltip,
      label,
      onClick,
      onKeyDown,
    },
    ref
  ) => {
    const toolbarProps = useContext(ToolbarContext);
    const useSize = size === undefined ? toolbarProps.size : size ?? "default";
    return (
      <button
        type={"button"}
        onClick={onClick}
        onKeyDown={onKeyDown}
        className={className({
          [styles.toolButton]: true,
          [styles.active]: active,
          [styles.small]: useSize === "small",
          [styles.notificationBadge]: notificationBadge,
          [styles.shadow]: shadow,
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
