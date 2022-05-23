import { Control, NumberInput } from "../../ui-components";

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
      value={value}
      minValue={minValue}
      maxValue={maxValue}
      onChange={onChange}
    />
  </Control>
);
