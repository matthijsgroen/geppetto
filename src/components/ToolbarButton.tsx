import React from "react";
import styled, { css } from "styled-components";

interface TabIconProps {
  icon: string;
  label: string;
  size?: "medium" | "small";
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
    props.isActive ? props.theme.colors.textSelected : props.theme.colors.text};
  opacity: ${(props) => (props.isDisabled ? "0.2" : "1")};
  font-size: ${(props) => (props.size === "small" ? "0.75rem" : "1.5rem")};
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
      ? props.theme.colors.backgroundSelected
      : props.theme.colors.backgroundSecondary};
  align-items: center;
  justify-content: center;
  border: none;
  border-left: 2px solid
    ${(props) =>
      props.isDisabled
        ? "transparent"
        : props.theme.colors.backgroundSecondary};
  outline: none;
`;

const ToolbarButton: React.FC<TabIconProps> = ({
  icon,
  label,
  size = "medium",
  disabled = false,
  active = false,
  onClick,
}) => (
  <IconButton
    isDisabled={disabled}
    isActive={active}
    size={size}
    onClick={() => onClick && !disabled && onClick()}
  >
    {icon} {label}
  </IconButton>
);

export default ToolbarButton;
