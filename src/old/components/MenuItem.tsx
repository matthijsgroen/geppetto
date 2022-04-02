import React from "react";
import styled from "styled-components";
import { Icon } from "../../ui-components/Icon/Icon";
import RenameableLabel from "./RenameableLabel";

interface MenuItemProps {
  label: string;
  name?: string;
  icon?: React.ReactNode;
  allowRename?: boolean;
  selected?: boolean;
  dimmed?: boolean;
  indent?: number;
  onClick?(e: React.MouseEvent): void;
  onRename?(newName: string): void;
}

const Item = styled.div<{
  selected: boolean;
  dimmed: boolean;
  indent: number;
  renaming: boolean;
}>`
  background: ${({ selected, theme }) =>
    selected ? theme.colors.controlActive : "none"};
  box-sizing: border-box;
  min-width: 100%;
  width: max-content;
  padding-left: calc(0.25rem + ${(props) => props.indent * 1.5}rem);
  padding-right: 0.25rem;
  padding-top: 0.1rem;
  padding-bottom: 0.1rem;
  color: ${({ selected, theme }) =>
    selected ? theme.colors.textActive : theme.colors.textDefault};
  opacity: ${({ selected, dimmed }) => (selected ? 1 : dimmed ? 0.3 : 1.0)};
  font: menu;
  font-size: 1rem;
  font-weight: normal;
  white-space: nowrap;
  cursor: default;
`;

const MenuItem: React.VFC<MenuItemProps> = ({
  label,
  name = label,
  icon,
  allowRename = false,
  selected = false,
  dimmed = false,
  indent = 0,
  onClick,
  onRename,
}) => {
  return (
    <Item
      onClick={onClick}
      selected={selected}
      dimmed={dimmed}
      indent={indent}
      renaming={true}
    >
      <Icon>{icon}</Icon>{" "}
      <RenameableLabel
        name={name}
        label={label}
        onRename={onRename}
        allowRename={allowRename}
      />
    </Item>
  );
};

export default MenuItem;
