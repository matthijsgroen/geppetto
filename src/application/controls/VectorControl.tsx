import { useCallback } from "react";
import { Vec2 } from "../../types";
import { Control, NumberInput } from "../../ui-components";

type VectorControlProps = {
  label?: string;
  value?: Vec2;
  onChange?: (newValue: Vec2) => void;
};

export const VectorControl: React.FC<VectorControlProps> = ({
  label,
  value = [0, 0],
  onChange,
}) => {
  const xChangeHandler = useCallback(
    (val: number) => {
      onChange && val !== value[0] && onChange([val, value[1]]);
    },
    [onChange, value]
  );

  const yChangeHandler = useCallback(
    (val: number) => {
      onChange && val !== value[1] && onChange([value[0], val]);
    },
    [onChange, value]
  );
  return (
    <Control label={label} htmlFor={`${label}_Field`}>
      <NumberInput
        htmlId={`${label}_Field`}
        value={value[0]}
        prefix="x:"
        onChange={xChangeHandler}
      />
      <NumberInput value={value[1]} prefix="y:" onChange={yChangeHandler} />
    </Control>
  );
};
