import { Control, NumberInput } from "@/ui/components";

type NumberControlProps = {
  label?: string;
  value?: number;
  minValue?: number;
  maxValue?: number;
  onChange?: (newValue: number) => void;
  onBlur?: () => void;
  onFocus?: () => void;
};

export const NumberControl: React.FC<NumberControlProps> = ({
  label,
  value = 0,
  minValue,
  maxValue,
  onChange,
  onBlur,
  onFocus,
}) => (
  <Control label={label}>
    <NumberInput
      maxValue={maxValue}
      minValue={minValue}
      onBlur={onBlur}
      onChange={onChange}
      onFocus={onFocus}
      value={value}
    />
  </Control>
);
