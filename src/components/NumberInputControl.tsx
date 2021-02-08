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

const NumberInput = styled.input.attrs({ type: "number" })`
  text-align: right;
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