import { clsx } from "clsx";
import { type FC, type ReactNode, type Ref, use } from "react";

import { Label } from "@/ui/components/atoms/Label/Label";
import { type ToolBarSize } from "@/ui/components/molecules/ToolBar/ToolBar";
import { ToolbarContext } from "@/ui/components/molecules/ToolBar/ToolBarContext";

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
  const useSize = size === undefined ? toolbarProps.size : (size ?? "default");
  const useVertical =
    vertical === undefined ? toolbarProps.vertical : (vertical ?? false);
  return (
    <button
      type="button"
      className={clsx(
        `inline-flex items-center bg-toolbar bg-no-repeat whitespace-nowrap outline-2 outline-transparent font-caption focus-visible:outline-control-focus enabled:hover:bg-control-highlight disabled:opacity-50`,
        {
          "border-transparent text-text": !active,
          "border-control-active text-active": active,
          "mt-0.5 gap-2 border-b-3 px-4": !useVertical,
          "h-[calc(3rem-3px)]": !useVertical && useSize === "default",
          "h-[calc(2.25rem-3px)]": !useVertical && useSize === "small",
          "w-[calc(3rem-3px)]": useVertical && useSize === "default",
          "w-[calc(2.25rem-3px)]": useVertical && useSize === "small",
          "mr-0.5 h-fit flex-col gap-2 border-l-3 py-4": useVertical,
          "from-panel via-panel/50 to-toolbar/0": active,
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
