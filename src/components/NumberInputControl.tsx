import React from "react";
import styled from "styled-components";
import { Control, ControlLabel } from "./Control";

export const NumberInput = styled.input.attrs({ type: "number", size: 6 })`
  text-align: right;
  width: 5em;
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.itemContainerBackground};
  border: 1px solid ${({ theme }) => theme.colors.backgroundSecondary};
  flex: 0;
`;

interface SliderControlProps {
  title?: string;
  value: number;
  disabled?: boolean;
  onChange(newValue: number): void;
}

const NumberInputControl: React.FC<SliderControlProps> = ({
  title,
  value,
  disabled = false,
  onChange,
}) => (
  <Control>
    {title && <ControlLabel>{title}</ControlLabel>}
    <NumberInput
      disabled={disabled}
      value={value}
      onChange={(e) => onChange(e.currentTarget.valueAsNumber)}
    />
  </Control>
);

export default NumberInputControl;
