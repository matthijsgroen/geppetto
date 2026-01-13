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
      className={clsx(
        "inline-flex items-center bg-toolbar bg-no-repeat whitespace-nowrap outline-2 outline-transparent font-caption",
        "focus-visible:border-control-focus focus-visible:from-panel focus-visible:via-panel/50 focus-visible:to-toolbar/0 focus-visible:text-control-focus focus-visible:outline-control-focus",
        "enabled:hover:bg-control-highlight disabled:opacity-50",
        // Active/inactive border and text
        active
          ? "border-control-active from-panel via-panel/50 to-toolbar/0 text-active"
          : "border-transparent text-text",
        // Vertical/horizontal layout
        useVertical
          ? "mr-0.5 h-fit flex-col gap-2 rounded-r-sm border-l-3 py-4"
          : "mt-0.5 gap-2 rounded-t-sm border-b-3",
        // Padding and margin by size
        !useVertical && useSize === "minimal" && "h-6.5 px-2",
        !useVertical && useSize === "default" && "h-11.25 px-4",
        !useVertical && useSize === "small" && "h-8.25 px-4",
        useVertical && useSize === "default" && "w-11.25",
        useVertical && useSize === "small" && "w-8.25",
        useVertical && useSize === "minimal" && "w-7",
        // Focus/active radial backgrounds
        !useVertical
          ? "focus-visible:bg-radial-[farthest-side] focus-visible:bg-position-[0em_1em]"
          : "focus-visible:bg-radial-[closest-side] focus-visible:bg-position-[-1em_0em]",
        active &&
          !useVertical &&
          "bg-radial-[farthest-side] bg-position-[0em_1em]",
        active &&
          useVertical &&
          "bg-radial-[closest-side] bg-position-[-1em_0em]"
      )}
      disabled={disabled}
      onClick={onClick}
      onKeyDown={onKeydown}
      ref={ref}
      title={tooltip}
      type="button"
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
