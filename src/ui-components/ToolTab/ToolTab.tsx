import { forwardRef } from "react";
import styled from "styled-components";
import { Label } from "../Label/Label";

type ToolTabProps = {
  label?: React.ReactChild;
  icon?: React.ReactChild;
  active?: boolean;
  disabled?: boolean;
  tooltip?: string;
  onClick?: () => void;
  onKeyDown?: () => void;
};

const TabButton = styled.button.attrs({ type: "button" })<{
  isActive?: boolean;
}>`
  font: caption;
  display: inline-block;
  background-color: ${(props) => props.theme.colors.controlDefault};
  color: ${(props) =>
    props.isActive
      ? props.theme.colors.textActive
      : props.theme.colors.textDefault};
  font-size: 1rem;

  height: 40px;
  margin-top: 2px;

  align-items: center;
  border: none;
  border-bottom: 3px solid
    ${(props) =>
      props.isActive ? props.theme.colors.controlActive : "transparent"};

  outline: 2px solid transparent;
  padding: 0 1rem;
  white-space: nowrap;

  &:disabled {
    opacity: 0.5;
  }
  &:focus {
    outline-color: ${(props) => props.theme.colors.controlFocus};
  }
  &:hover:enabled {
    background-color: ${(props) => props.theme.colors.controlHighlight};
  }
`;

export const ToolTab = forwardRef<HTMLButtonElement, ToolTabProps>(
  (
    { icon, label, disabled, active, tooltip, onClick, onKeyDown: onKeydown },
    ref
  ) => (
    <TabButton
      onClick={onClick}
      onKeyDown={onKeydown}
      disabled={disabled}
      isActive={active}
      title={tooltip}
      ref={ref}
    >
      {icon} {label && <Label active={active}>{label}</Label>}
    </TabButton>
  )
);
