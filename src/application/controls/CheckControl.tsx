import { Control, CheckInput } from "../../ui-components";

type CheckControlProps = {
  label?: string;
  value?: boolean;
  onChange?: (newValue: boolean) => void;
};

export const CheckControl: React.FC<CheckControlProps> = ({
  label,
  value = false,
  onChange,
}) => (
  <Control label={label}>
    <CheckInput value={value} onChange={onChange} />
  </Control>
);
