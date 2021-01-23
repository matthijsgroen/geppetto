import React from "react";
import styled from "styled-components";

interface TabIconProps {
  icon: string;
  title: string;
  active?: boolean;
  onClick: () => void;
}

interface IconProps {
  isActive: boolean;
}

const Icon = styled.button.attrs({ type: "button" })<IconProps>`
  width: 42px;
  height: 42px;
  display: flex;
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
`;

const TabIcon: React.FC<TabIconProps> = ({
  icon,
  title,
  active = false,
  onClick,
}) => (
  <Icon title={title} isActive={active} onClick={onClick}>
    {icon}
  </Icon>
);

export default TabIcon;
