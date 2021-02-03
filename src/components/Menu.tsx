import React from "react";
import styled from "styled-components";

interface MenuProps {
  title: string;
  items: React.ReactElement | React.ReactElement[];
  toolbarItems?: React.ReactElement | React.ReactElement[];
}

const MenuContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.itemContainerBackground};
  width: 100%;
  height: 100%;
  padding: 0 2px;
`;

const MenuHeader = styled.h1`
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.background};
  font-size: 16px;
  font-weight: normal;
  margin: 0;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.text};
`;

const Toolbar = styled.div`
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.background};
  font-size: 16px;
  font-weight: normal;
  margin: 0;
  padding: 0.1rem 0.5rem;
  display: flex;
  flex-direction: row;
  > * + * {
    margin-left: 0.25rem;
  }
`;

const hasItems = (items: React.ReactElement | React.ReactElement[]): boolean =>
  Array.isArray(items) ? items.length > 0 : !!items;

const Menu: React.FC<MenuProps> = ({ title, items, toolbarItems = [] }) => (
  <MenuContainer>
    <MenuHeader>{title}</MenuHeader>
    {hasItems(toolbarItems) && <Toolbar>{toolbarItems}</Toolbar>}
    {items}
  </MenuContainer>
);

export default Menu;
