import { Control, NumberInput } from "@/ui/components";

type NumberControlProps = {
  label?: string;
  value?: number;
  minValue?: number;
  maxValue?: number;
  onChange?: (newValue: number) => void;
};

export const NumberControl: React.FC<NumberControlProps> = ({
  label,
  value = 0,
  minValue,
  maxValue,
  onChange,
}) => (
  <Control label={label}>
    <NumberInput
      maxValue={maxValue}
      minValue={minValue}
      onChange={onChange}
      value={value}
    />
  </Control>
);
