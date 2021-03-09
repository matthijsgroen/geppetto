import React from "react";
import styled from "styled-components";
import { Control, ControlLabel } from "./Control";

const Slider = styled.input.attrs({ type: "range" })`
  width: 100px;
`;

const Value = styled.p`
  font-size: 0.7rem;
  text-align: right;
  padding-right: 1em;
  margin: 0;
`;

interface SliderControlProps {
  title?: string;
  showValue?: boolean;
  value: number;
  min: number;
  max: number;
  step: number;
  selected?: boolean;
  onChange(newValue: number): void;
  onSelect?(): void;
}

const SliderControl: React.VFC<SliderControlProps> = ({
  title,
  min,
  max,
  step,
  value,
  selected = false,
  showValue = false,
  onChange,
  onSelect,
}) => (
  <Control selected={selected}>
    {title && (
      <ControlLabel selected={selected} title={title} onClick={onSelect}>
        {title}
      </ControlLabel>
    )}
    <div>
      {showValue && <Value>{Math.round(value * 10e3) / 10e3}</Value>}
      <Slider
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(e.currentTarget.valueAsNumber)}
      />
    </div>
  </Control>
);

export default SliderControl;
