import React from "react";
import { Vec2 } from "src/lib/types";
import { Control, ControlLabel } from "./Control";
import { NumberInput } from "./NumberInputControl";

interface SliderControlProps {
  title?: string;
  value: Vec2;
  disabled?: boolean;
  onChange(newValue: Vec2): void;
}

const Vect2InputControl: React.FC<SliderControlProps> = ({
  title,
  value,
  disabled = false,
  onChange,
}) => (
  <Control>
    {title && <ControlLabel>{title}</ControlLabel>}
    <NumberInput
      disabled={disabled}
      value={value[0]}
      onChange={(e) => onChange([e.currentTarget.valueAsNumber, value[1]])}
    />
    <NumberInput
      disabled={disabled}
      value={value[1]}
      onChange={(e) => onChange([value[0], e.currentTarget.valueAsNumber])}
    />
  </Control>
);

export default Vect2InputControl;
