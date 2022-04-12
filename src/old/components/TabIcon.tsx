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
    props.isActive
      ? props.theme.colors.textActive
      : props.theme.colors.textDefault};
  font-size: 1.5rem;
  background-color: ${(props) =>
    props.isActive
      ? props.theme.colors.controlActive
      : props.theme.colors.controlDefault};
  align-items: center;
  justify-content: center;
  border: none;
  border-left: 2px solid
    ${(props) =>
      props.isActive
        ? props.theme.colors.textActive
        : props.theme.colors.backgroundWorkspace};
  outline: none;
  text-shadow: #000 0px 0px 1px;

  &:disabled {
    opacity: 0.3;
  }
`;

const TabIcon: React.VFC<TabIconProps> = ({
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
