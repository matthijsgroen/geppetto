import React from "react";
import styled from "styled-components";

const Control = styled.div`
  padding: 0.5rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.text};
`;

const ControlLabel = styled.p`
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

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
