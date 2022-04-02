import React from "react";
import styled from "styled-components";
import { Control, ControlLabel } from "./Control";

export const ToggleInput = styled.input.attrs({ type: "checkbox" })`
  text-align: right;
  color: ${({ theme }) => theme.colors.textDefault};
  flex: 0;
`;

interface ToggleControlProps {
  title?: string;
  value: boolean;
  disabled?: boolean;
  onChange(newValue: boolean): void;
}

const ToggleInputControl: React.VFC<ToggleControlProps> = ({
  title,
  value,
  disabled = false,
  onChange,
}) => (
  <Control>
    {title && <ControlLabel>{title}</ControlLabel>}
    <ToggleInput
      disabled={disabled}
      checked={value}
      onChange={(e) => onChange(e.currentTarget.checked)}
    />
  </Control>
);

export default ToggleInputControl;
