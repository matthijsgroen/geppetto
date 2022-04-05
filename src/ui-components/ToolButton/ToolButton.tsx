import styled, { css } from "styled-components";
import { Label } from "../Label/Label";

type ToolButtonProps = {
  icon?: React.ReactChild;
  label?: string;
  active?: boolean;
  disabled?: boolean;
  tooltip?: string;
  onClick?: () => void;
};

type StyledButtonProps = {
  isDisabled?: boolean;
  isActive?: boolean;
  isFocus?: boolean;
  size: "small" | "medium";
};

const StyledButton = styled.button.attrs({ type: "button" })<StyledButtonProps>`
  display: inline-block;
  color: ${(props) =>
    props.isActive
      ? props.theme.colors.textActive
      : props.theme.colors.textDefault};
  font-size: ${(props) => (props.size === "small" ? "0.5rem" : "1rem")};
  ${(props) =>
    props.size === "medium"
      ? css`
          height: 32px;
          min-width: 32px;
        `
      : ""}
  background-color: ${(props) =>
    props.isActive
      ? props.theme.colors.controlActive
      : props.theme.colors.controlDefault};
  align-items: center;
  border: none;
  border-radius: 10px;
  white-space: nowrap;
  outline: 2px solid transparent;

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

export const ToolButton: React.FC<ToolButtonProps> = ({
  icon,
  active = false,
  disabled,
  tooltip,
  label,
  onClick,
}) => (
  <StyledButton
    onClick={onClick}
    size={"medium"}
    isActive={active}
    disabled={disabled}
    title={tooltip}
  >
    {icon} {label && <Label active={active}>{label}</Label>}
  </StyledButton>
);
