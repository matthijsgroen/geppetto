import type { Vec2 } from "@geppetto/types";
import { useCallback } from "react";

import { Control, NumberInput } from "@/ui/components";

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
      if (val !== value[0]) {
        onChange?.([val, value[1]]);
      }
    },
    [onChange, value]
  );

  const yChangeHandler = useCallback(
    (val: number) => {
      if (val !== value[1]) {
        onChange?.([value[0], val]);
      }
    },
    [onChange, value]
  );
  return (
    <Control htmlFor={`${label}_Field`} label={label}>
      <NumberInput
        htmlId={`${label}_Field`}
        onChange={xChangeHandler}
        prefix="x:"
        value={value[0]}
      />
      <NumberInput onChange={yChangeHandler} prefix="y:" value={value[1]} />
    </Control>
  );
};
