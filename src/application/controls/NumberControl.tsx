import { Control, NumberInput } from "../../ui-components";

type NumberControlProps = {
  label?: string;
  value?: number;
  onChange?: (newValue: number) => void;
};

export const NumberControl: React.FC<NumberControlProps> = ({
  label,
  value = 0,
  onChange,
}) => (
  <Control label={label}>
    <NumberInput value={value} onChange={onChange} />
  </Control>
);
