import clsx from "clsx";
import {
  type FC,
  type KeyboardEventHandler,
  type MouseEventHandler,
  type ReactNode,
  type Ref,
  use,
} from "react";

import { type ToolBarSize } from "../../molecules/ToolBar/ToolBar";
import { ToolbarContext } from "../../molecules/ToolBar/ToolBarContext";
import { Label } from "../Label/Label";

type ToolButtonProps = {
  active?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  label?: string;
  notificationBadge?: boolean;
  standAlone: boolean;
  size?: ToolBarSize;
  tooltip?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  onKeyDown?: KeyboardEventHandler<HTMLButtonElement>;
  onContextMenu?: MouseEventHandler<HTMLButtonElement>;
  ref?: Ref<HTMLButtonElement>;
};

export const ToolButton: FC<ToolButtonProps> = ({
  icon,
  active = false,
  notificationBadge = false,
  size,
  standAlone = false,
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
  return (
    <button
      aria-label={tooltip}
      {...props}
      title={tooltip}
      type="button"
      onClick={onClick}
      onKeyDown={onKeyDown}
      onContextMenu={onContextMenu}
      className={clsx(
        `align-center relative inline-block border-0 whitespace-nowrap outline-2 outline-transparent`,
        `focus:outline-control-focus hover:enabled:bg-control-highlight disabled:opacity-50`,
        {
          "bg-toolbar text-text": !active && !standAlone,
          "bg-control-interaction text-text": !active && standAlone,
          "bg-control-active text-active": active,
          "h-6 min-w-6 rounded-control-small px-1 text-xs": useSize === "small",
          "inline-block h-8 min-w-8 rounded-control px-2":
            useSize === "default",
          "before:absolute before:block before:size-2.5 before:rounded-full before:bg-notification before:text-transparent before:content-['.']":
            notificationBadge,
          "before:-top-1 before:-right-1":
            notificationBadge && useSize === "default",
          "before:-top-0.5 before:-right-0.5":
            notificationBadge && useSize === "small",
          "shadow-md": standAlone,
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
