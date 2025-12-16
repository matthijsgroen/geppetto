import { FC, ReactNode, Ref, use } from "react";
import { Label } from "../Label/Label";
import { ToolBarSize } from "../../molecules/ToolBar/ToolBar";
import { ToolbarContext } from "../../molecules/ToolBar/ToolBarContext";
import { clsx } from "clsx";

type ToolTabProps = {
  label?: ReactNode;
  icon?: ReactNode;
  active?: boolean;
  disabled?: boolean;
  size?: ToolBarSize;
  vertical?: boolean;
  tooltip?: string;
  ref?: Ref<HTMLButtonElement>;
  onClick?: () => void;
  onKeyDown?: () => void;
};

export const ToolTab: FC<ToolTabProps> = ({
  icon,
  label,
  disabled,
  active = false,
  size,
  vertical,
  tooltip,
  onClick,
  onKeyDown: onKeydown,
  ref,
}) => {
  const toolbarProps = use(ToolbarContext);
  const useSize = size === undefined ? toolbarProps.size : size ?? "default";
  const useVertical =
    vertical === undefined ? toolbarProps.vertical : vertical ?? false;
  return (
    <button
      type="button"
      className={clsx(
        "font-caption inline-flex bg-panel enabled:hover:bg-control-highlight disabled:opacity-50 focus-visible:outline-active bg-no-repeat items-center outline-2 outline-transparent whitespace-nowrap",
        {
          "text-text border-transparent": !active,
          "text-active border-control-active": active,
          "border-b-3 mt-0.5 gap-2 px-4": !useVertical,
          "h-[calc(3rem-3px)]": !useVertical && useSize === "default",
          "h-[calc(2.25rem-3px)]": !useVertical && useSize === "small",
          "w-[calc(3rem-3px)]": useVertical && useSize === "default",
          "w-[calc(2.25rem-3px)]": useVertical && useSize === "small",
          "flex-col gap-2 py-4 border-l-3 mr-0.5 h-fit": useVertical,
          "from-control-default via-control-default/50 to-panel/0": active,
          "bg-radial-[farthest-side] bg-position-[0em_1em]":
            active && !useVertical,
          "bg-radial-[closest-side] bg-position-[-1em_0em]":
            active && useVertical,
        }
      )}
      onClick={onClick}
      onKeyDown={onKeydown}
      disabled={disabled}
      title={tooltip}
      ref={ref}
    >
      {icon}
      {label && (
        <Label active={active} size={useSize} vertical={useVertical}>
          {label}
        </Label>
      )}
    </button>
  );
};
