import React, { useState } from "react";
import styled, { css } from "styled-components";

interface MenuItemProps {
  label: string;
  name?: string;
  icon?: React.ReactNode;
  allowRename?: boolean;
  selected?: boolean;
  indent?: number;
  onClick?(e: React.MouseEvent): void;
  onRename?(newName: string): void;
}

const Item = styled.div<{
  selected: boolean;
  indent: number;
  renaming: boolean;
}>`
  background: ${({ selected, theme }) =>
    selected ? theme.colors.backgroundSelected : "none"};
  padding-left: calc(0.25rem + ${(props) => props.indent * 1.5}rem);
  padding-right: 0.25rem;
  padding-top: 0.1rem;
  padding-bottom: 0.1rem;
  color: ${({ selected, theme }) =>
    selected ? theme.colors.textSelected : theme.colors.text};
  font-size: 1rem;
  font-weight: normal;
  ${({ renaming }) =>
    renaming &&
    css`
      white-space: nowrap;
    `}
  cursor: default;
`;

const RenameInput = styled.input.attrs({
  type: "text",
  autoFocus: true,
})`
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  color: ${({ theme }) => theme.colors.textSelected};
  font-size: 1rem;
  font-weight: normal;
  width: max-content;
  padding: 0.2rem;
  outline: none;
  border: 1px solid ${({ theme }) => theme.colors.textSelected};
`;

const MenuItem: React.FC<MenuItemProps> = ({
  label,
  name = label,
  icon,
  allowRename = false,
  selected,
  indent = 0,
  onClick,
  onRename,
}) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(name);

  return (
    <Item
      onClick={onClick}
      selected={!!selected}
      indent={indent}
      renaming={isRenaming}
      onDoubleClick={() => {
        allowRename && !isRenaming && setIsRenaming(true);
      }}
    >
      {icon}{" "}
      {isRenaming ? (
        <RenameInput
          value={newName}
          onChange={(event) => {
            setNewName(event.target.value);
          }}
          onKeyUp={(e) => {
            if (e.key === "Escape") {
              setNewName(name);
              setIsRenaming(false);
            }
            if (e.key === "Enter") {
              if (newName !== name && newName.trim().length > 0) {
                onRename && onRename(newName);
              }
              setIsRenaming(false);
            }
          }}
          onBlur={() => {
            if (newName !== name && newName.trim().length > 0) {
              onRename && onRename(newName);
            }
            setIsRenaming(false);
          }}
        />
      ) : (
        label
      )}
    </Item>
  );
};

export default MenuItem;
