import React from "react";
import { Vec2 } from "../lib/types";
import { Control, ControlLabel } from "./Control";
import {
  NumberInput,
  numberStepControl,
  StepSize,
  UpDown,
} from "./NumberInputControl";

interface SliderControlProps {
  title?: string;
  value: Vec2;
  disabled?: boolean;
  step?: number;
  onChange(newValue: Vec2): void;
  onStep?(value: number, upDown: UpDown, size: StepSize): number;
}

const Vect2InputControl: React.VFC<SliderControlProps> = ({
  title,
  value,
  disabled = false,
  step = 1,
  onChange,
  onStep,
}) => (
  <Control>
    {title && <ControlLabel>{title}</ControlLabel>}
    x
    <NumberInput
      disabled={disabled}
      value={value[0]}
      step={step}
      onChange={(e) => onChange([e.currentTarget.valueAsNumber, value[1]])}
      onKeyDown={numberStepControl(
        (stepValue) => onChange([stepValue, value[1]]),
        onStep
      )}
    />
    y
    <NumberInput
      disabled={disabled}
      value={value[1]}
      step={step}
      onChange={(e) => onChange([value[0], e.currentTarget.valueAsNumber])}
      onKeyDown={numberStepControl(
        (stepValue) => onChange([value[0], stepValue]),
        onStep
      )}
    />
  </Control>
);

export default Vect2InputControl;
