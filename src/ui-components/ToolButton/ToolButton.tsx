import { forwardRef } from "react";
import styled, { css } from "styled-components";
import { Label } from "../Label/Label";

type ToolButtonProps = {
  icon?: React.ReactChild;
  label?: string;
  active?: boolean;
  disabled?: boolean;
  tooltip?: string;
  size?: "default" | "small";
  onClick?: () => void;
  onKeyDown?: () => void;
};

type StyledButtonProps = {
  isDisabled?: boolean;
  isActive?: boolean;
  isFocus?: boolean;
  size: "default" | "small";
};

const StyledButton = styled.button.attrs({ type: "button" })<StyledButtonProps>`
  display: inline-block;
  color: ${(props) =>
    props.isActive
      ? props.theme.colors.textActive
      : props.theme.colors.textDefault};
  font-size: ${(props) => (props.size === "default" ? "1rem" : "0.75rem")};
  ${(props) =>
    props.size === "default"
      ? css`
          height: 32px;
          min-width: 32px;
        `
      : css`
          height: 24px;
          min-width: 24px;
        `}
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

export const ToolButton = forwardRef<HTMLButtonElement, ToolButtonProps>(
  (
    {
      icon,
      active = false,
      size = "default",
      disabled,
      tooltip,
      label,
      onClick,
      onKeyDown,
    },
    ref
  ) => (
    <StyledButton
      onClick={onClick}
      onKeyDown={onKeyDown}
      size={size}
      isActive={active}
      disabled={disabled}
      title={tooltip}
      ref={ref}
    >
      {icon} {label && <Label active={active}>{label}</Label>}
    </StyledButton>
  )
);
