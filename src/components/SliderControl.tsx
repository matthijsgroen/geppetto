import React from "react";
import styled from "styled-components";

const Control = styled.div``;
const Slider = styled.input.attrs({ type: "range" })``;

interface SliderControlProps {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange(newValue: number): void;
}

const SliderControl: React.FC<SliderControlProps> = ({
  min,
  max,
  step,
  value,
  onChange,
}) => (
  <Control>
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
