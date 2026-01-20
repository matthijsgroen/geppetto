import clsx from "clsx";
import type { RefObject } from "react";
import {
  type FC,
  type KeyboardEventHandler,
  type MouseEventHandler,
  type ReactNode,
  use,
} from "react";

import { type ToolBarSize } from "@/ui/components/molecules/ToolBar/ToolBar";
import { ToolbarContext } from "@/ui/components/molecules/ToolBar/ToolBarContext";

type ToolButtonProps = {
  active?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  label?: ReactNode;
  notificationBadge?: boolean;
  standAlone?: boolean;
  size?: ToolBarSize;
  tooltip?: string;
  keyboardFocusOnly?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  onKeyDown?: KeyboardEventHandler<HTMLButtonElement>;
  onContextMenu?: MouseEventHandler<HTMLButtonElement>;
  ref?: RefObject<HTMLButtonElement | null>;
};

export const ToolButton: FC<ToolButtonProps> = ({
  icon,
  active = false,
  notificationBadge = false,
  size,
  standAlone = false,
  keyboardFocusOnly = false,
  disabled,
  tooltip,
  label,
  onClick,
  onKeyDown,
  onContextMenu,
  ref,
  ...props
}) => {
  const toolbarProps = use(ToolbarContext);
  const useSize = size === undefined ? toolbarProps.size : (size ?? "default");
  const displayButton = !keyboardFocusOnly || (keyboardFocusOnly && active);
  return (
    <button
      aria-label={tooltip}
      {...props}
      className={clsx(
        "relative inline-flex flex-row items-center justify-center gap-1 border-0 whitespace-nowrap outline-2 outline-transparent",
        "focus:outline-control-focus hover:enabled:bg-control-highlight disabled:opacity-50",
        {
          "bg-toolbar text-text": !active && !standAlone,
          "bg-control-interaction text-text": !active && standAlone,
          "bg-control-active text-active": active,

          "h-6 rounded-control-small text-xs":
            useSize === "small" || useSize === "minimal",
          "min-w-6 px-1":
            (useSize === "small" || useSize === "minimal") && displayButton,
          "focus:min-w-6 focus:px-1":
            (useSize === "small" || useSize === "minimal") && !displayButton,

          "h-8 rounded-control": useSize === "default",
          "min-w-8 px-2": useSize === "default" && displayButton,
          "focus:min-w-8 focus:px-2": useSize === "default" && !displayButton,

          "w-0 opacity-0 focus:visible focus:w-auto focus:opacity-100":
            !displayButton,

          "before:absolute before:block before:size-2.5 before:rounded-full before:bg-notification before:text-transparent before:content-['.']":
            notificationBadge,
          "before:-top-1 before:-right-1":
            notificationBadge && useSize === "default",
          "before:-top-0.5 before:-right-0.5":
            notificationBadge && (useSize === "small" || useSize === "minimal"),
          "shadow-md": standAlone,
        }
      )}
      disabled={disabled}
      onClick={onClick}
      onContextMenu={onContextMenu}
      onKeyDown={onKeyDown}
      ref={ref}
      title={tooltip}
      type="button"
    >
      {icon}
      {label && (
        <span
          className={clsx("contents py-1 font-caption", {
            ["text-text"]: !active,
            ["text-active"]: active,
            ["text-xs"]: useSize === "small" || useSize === "minimal",
          })}
        >
          {label}
        </span>
      )}
    </button>
  );
};
