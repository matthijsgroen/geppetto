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
  active?: boolean;
  disabled?: boolean;
  icon?: React.ReactChild;
  label?: string;
  notificationBadge?: boolean;
  shadow?: boolean;
  size?: ToolBarSize;
  tooltip?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  onKeyDown?: KeyboardEventHandler<HTMLButtonElement>;
  onContextMenu?: MouseEventHandler<HTMLButtonElement>;
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
      onContextMenu,
      ...props
    },
    ref
  ) => {
    const toolbarProps = useContext(ToolbarContext);
    const useSize = size === undefined ? toolbarProps.size : size ?? "default";
    return (
      <button
        aria-label={tooltip}
        {...props}
        title={tooltip}
        type={"button"}
        onClick={onClick}
        onKeyDown={onKeyDown}
        onContextMenu={onContextMenu}
        className={className({
          [styles.toolButton]: true,
          [styles.active]: active,
          [styles.small]: useSize === "small",
          [styles.notificationBadge]: notificationBadge,
          [styles.shadow]: shadow,
        })}
        disabled={disabled}
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
