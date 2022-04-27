import { forwardRef } from "react";
import styles from "./ToolTab.module.css";
import { className } from "../className";
import { Label } from "../Label/Label";

type ToolTabProps = {
  label?: React.ReactChild;
  icon?: React.ReactChild;
  active?: boolean;
  disabled?: boolean;
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
      tooltip,
      onClick,
      onKeyDown: onKeydown,
    },
    ref
  ) => (
    <button
      type="button"
      className={className({ [styles.toolTab]: true, [styles.active]: active })}
      onClick={onClick}
      onKeyDown={onKeydown}
      disabled={disabled}
      title={tooltip}
      ref={ref}
    >
      {icon} {label && <Label active={active}>{label}</Label>}
    </button>
  )
);

ToolTab.displayName = "ToolTab";
