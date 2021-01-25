import React from "react";
import styled from "styled-components";

interface MenuItemProps {
  name: string;
  selected?: boolean;
  onClick?(e: React.MouseEvent): void;
}

const Item = styled.div<{ selected: boolean }>`
  background-color: ${({ selected, theme }) =>
    selected ? theme.colors.backgroundSelected : theme.colors.background};
  padding: 0.5rem 0.2rem;
  color: ${({ selected, theme }) =>
    selected ? theme.colors.textSelected : theme.colors.text};
  font-size: 16px;
  font-weight: normal;
  cursor: default;
`;

const MenuItem: React.FC<MenuItemProps> = ({ name, selected, onClick }) => (
  <Item onClick={onClick} selected={!!selected}>
    {name}
  </Item>
);

export default MenuItem;
