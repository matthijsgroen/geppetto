import { ChangeEvent, useCallback } from "react";
import { Control } from "../../ui-components";

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
      onChange && onChange(e.currentTarget.checked);
    },
    [onChange]
  );
  return (
    <Control label={label}>
      <input type="checkbox" checked={value} onChange={eventHandler} />
    </Control>
  );
};
