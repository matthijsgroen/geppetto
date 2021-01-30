import React from "react";
import styled from "styled-components";

interface MenuItemProps {
  name: string;
  selected?: boolean;
  indent?: number;
  onClick?(e: React.MouseEvent): void;
}

const Item = styled.div<{ selected: boolean; indent: number }>`
  background: ${({ selected, theme }) =>
    selected ? theme.colors.backgroundSelected : "none"};
  padding-left: calc(0.5rem + ${(props) => props.indent * 1.5}rem);
  padding-right: 0.5rem;
  padding-top: 0.2rem;
  padding-bottom: 0.2rem;
  color: ${({ selected, theme }) =>
    selected ? theme.colors.textSelected : theme.colors.text};
  font-size: 16px;
  font-weight: normal;
  cursor: default;
`;

const MenuItem: React.FC<MenuItemProps> = ({
  name,
  selected,
  indent = 0,
  onClick,
}) => (
  <Item onClick={onClick} selected={!!selected} indent={indent}>
    {name}
  </Item>
);

export default MenuItem;
