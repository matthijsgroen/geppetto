import { type ChangeEvent, useCallback } from "react";

import { Control, ToggleInput } from "@/ui/components";

type ToggleControlProps = {
  label?: string;
  value?: boolean;
  onChange?: (newValue: boolean) => void;
};

export const ToggleControl: React.FC<ToggleControlProps> = ({
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
