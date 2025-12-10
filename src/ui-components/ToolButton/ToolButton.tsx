import { useContext, MouseEventHandler, KeyboardEventHandler, FC } from "react";
import { Label } from "../Label/Label";
import { ToolbarContext } from "../ToolBar/ToolBarContext";
import { ToolBarSize } from "../ToolBar/ToolBar";
import clsx from "clsx";

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
  ref?: React.Ref<HTMLButtonElement>;
};

export const ToolButton: FC<ToolButtonProps> = ({
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
  ref,
  ...props
}) => {
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
      className={clsx(
        "inline-block relative align-center border-0 whitespace-nowrap outline-2 outline-transparent",
        "disabled:opacity-50 focus:outline-control-focus-light dark:focus:outline-control-focus-dark hover:enabled:bg-control-highlight-light dark:hover:enabled:bg-control-highlight-dark",
        {
          "text-text-light dark:text-text-dark bg-panel-light dark:bg-panel-dark ":
            !active,
          "text-active-light dark:text-active-dark bg-control-active-light dark:bg-control-active-dark":
            active,
          "text-xs h-6 min-w-6 rounded-control-small px-1": useSize === "small",
          "inline-block h-8 min-w-8 rounded-control px-2":
            useSize === "default",
          "before:content-['.'] before:block before:size-2.5 before:bg-notification-light dark:before:bg-notification-dark before:text-transparent before:absolute before:rounded-full":
            notificationBadge,
          "before:-right-1 before:-top-1":
            notificationBadge && useSize === "default",
          "before:-right-0.5 before:-top-0.5":
            notificationBadge && useSize === "small",
          "shadow-md": shadow,
        }
      )}
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
};
