import { type ChangeEvent, useCallback } from "react";

import { Control, ToggleInput } from "@/ui/components";

type BooleanControlProps = {
  label?: string;
  value?: boolean;
  onChange?: (newValue: boolean) => void;
};

export const BooleanControl: React.FC<BooleanControlProps> = ({
  label,
  value = false,
  onChange,
}) => {
  const eventHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.currentTarget.checked);
    },
    [onChange]
  );
  return (
    <Control label={label}>
      <ToggleInput checked={value} onChange={eventHandler} />
    </Control>
  );
};
