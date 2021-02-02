import React from "react";
import styled from "styled-components";

interface TabIconProps {
  icon: string;
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

interface IconProps {
  isActive: boolean;
  isDisabled: boolean;
}

const IconButton = styled.button.attrs({ type: "button" })<IconProps>`
  display: flex;
  color: ${(props) =>
    props.isActive ? props.theme.colors.textSelected : props.theme.colors.text};
  opacity: ${(props) => (props.isDisabled ? "0.2" : "1")};
  font-size: 0.75rem;
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
        : props.isActive
        ? props.theme.colors.textSelected
        : props.theme.colors.backgroundSecondary};
  outline: none;
`;

const ToolbarButton: React.FC<TabIconProps> = ({
  icon,
  label,
  disabled = false,
  active = false,
  onClick,
}) => (
  <IconButton isDisabled={disabled} isActive={active} onClick={onClick}>
    {icon} {label}
  </IconButton>
);

export default ToolbarButton;
