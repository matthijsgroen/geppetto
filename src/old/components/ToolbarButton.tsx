import React from "react";
import styled, { css } from "styled-components";
import { Icon } from "../../ui-components/Icon/Icon";

interface ToolbarButtonProps {
  icon: string;
  label: string;
  size?: "medium" | "small";
  hint?: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

interface IconProps {
  isActive: boolean;
  isDisabled: boolean;
  size: string;
}

const IconButton = styled.button.attrs({ type: "button" })<IconProps>`
  display: flex;
  color: ${(props) =>
    props.isActive
      ? props.theme.colors.textActive
      : props.theme.colors.textDefault};
  opacity: ${(props) => (props.isDisabled ? "0.2" : "1")};
  font-size: ${(props) => (props.size === "small" ? "1rem" : "1.5rem")};
  ${(props) =>
    props.size === "medium"
      ? css`
          height: 42px;
          min-width: 42px;
        `
      : ""}
  background-color: ${(props) =>
    props.isDisabled
      ? "transparent"
      : props.isActive
      ? props.theme.colors.controlActive
      : props.theme.colors.controlDefault};
  align-items: center;
  justify-content: center;
  border: none;
  border-left: 2px solid
    ${(props) =>
      props.isDisabled ? "transparent" : props.theme.colors.controlActive};
  outline: none;
`;

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  icon,
  label,
  size = "medium",
  disabled = false,
  active = false,
  hint,
  onClick,
}) => (
  <IconButton
    isDisabled={disabled}
    isActive={active}
    title={hint}
    size={size}
    onClick={() => onClick && !disabled && onClick()}
  >
    <Icon>{icon}</Icon> {label}
  </IconButton>
);

export default ToolbarButton;
