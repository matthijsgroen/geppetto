import React from "react";
import styled from "styled-components";

interface TabIconProps {
  icon: string;
  title: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

interface IconProps {
  isActive: boolean;
}

const Icon = styled.button.attrs({ type: "button" })<IconProps>`
  width: 42px;
  height: 42px;
  display: flex;
  color: ${(props) =>
    props.isActive ? props.theme.colors.textSelected : props.theme.colors.text};
  font-size: 1.5rem;
  background-color: ${(props) =>
    props.isActive
      ? props.theme.colors.backgroundSelected
      : props.theme.colors.backgroundSecondary};
  align-items: center;
  justify-content: center;
  border: none;
  border-left: 2px solid
    ${(props) =>
      props.isActive
        ? props.theme.colors.textSelected
        : props.theme.colors.backgroundSecondary};
  outline: none;

  &:disabled {
    opacity: 0.3;
  }
`;

const TabIcon: React.FC<TabIconProps> = ({
  icon,
  title,
  active = false,
  disabled = false,
  onClick,
}) => (
  <Icon title={title} isActive={active} onClick={onClick} disabled={disabled}>
    {icon}
  </Icon>
);

export default TabIcon;
