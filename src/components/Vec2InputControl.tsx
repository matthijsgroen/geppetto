import React from "react";
import { Vec2 } from "src/lib/types";
import { Control, ControlLabel } from "./Control";
import { NumberInput } from "./NumberInputControl";

interface SliderControlProps {
  title?: string;
  value: Vec2;
  disabled?: boolean;
  step?: number;
  onChange(newValue: Vec2): void;
}

const Vect2InputControl: React.FC<SliderControlProps> = ({
  title,
  value,
  disabled = false,
  step = 1,
  onChange,
}) => (
  <Control>
    {title && <ControlLabel>{title}</ControlLabel>}
    x
    <NumberInput
      disabled={disabled}
      value={value[0]}
      step={step}
      onChange={(e) => onChange([e.currentTarget.valueAsNumber, value[1]])}
    />
    y
    <NumberInput
      disabled={disabled}
      value={value[1]}
      step={step}
      onChange={(e) => onChange([value[0], e.currentTarget.valueAsNumber])}
    />
  </Control>
);

export default Vect2InputControl;
