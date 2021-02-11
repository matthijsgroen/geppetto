import React from "react";
import styled from "styled-components";
import { Control, ControlLabel } from "./Control";

const Slider = styled.input.attrs({ type: "range" })``;

interface SliderControlProps {
  title?: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange(newValue: number): void;
}

const SliderControl: React.FC<SliderControlProps> = ({
  title,
  min,
  max,
  step,
  value,
  onChange,
}) => (
  <Control>
    {title && <ControlLabel>{title}</ControlLabel>}
    <Slider
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(e.currentTarget.valueAsNumber)}
    />
  </Control>
);

export default SliderControl;
