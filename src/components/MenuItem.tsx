import React from "react";
import styled from "styled-components";

interface MenuItemProps {
  name: string;
}

const Item = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  padding: 2px;
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  font-weight: normal;
`;

const MenuItem: React.FC<MenuItemProps> = ({ name }) => <Item>{name}</Item>;

export default MenuItem;
