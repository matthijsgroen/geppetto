import React from "react";
import styled from "styled-components";
import { Control, ControlLabel } from "./Control";

export const TextInput = styled.input.attrs({ type: "text", size: 20 })`
  width: 15em;
  color: ${({ theme }) => theme.colors.textDefault};
  background-color: ${({ theme }) => theme.colors.controlDefault};
  border: 1px solid ${({ theme }) => theme.colors.controlEdge};
  flex: 0;
`;

interface SliderControlProps {
  title?: string;
  value: string;
  disabled?: boolean;
  onChange(newValue: string): void;
}

const TextInputControl: React.VFC<SliderControlProps> = ({
  title,
  value,
  disabled = false,
  onChange,
}) => (
  <Control>
    {title && <ControlLabel>{title}</ControlLabel>}
    <TextInput
      disabled={disabled}
      value={value}
      onChange={(e) => onChange(e.currentTarget.value)}
    />
  </Control>
);

export default TextInputControl;
