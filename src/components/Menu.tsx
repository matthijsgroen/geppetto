import React from "react";
import styled from "styled-components";

interface MenuProps {
  title: string;
}

const MenuContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  width: 100%;
  height: 100%;
  padding: 2px;
`;

const MenuHeader = styled.h1`
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  font-weight: normal;
  margin: 0;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.text};
`;

const Menu: React.FC<MenuProps> = ({ title, children }) => (
  <MenuContainer>
    <MenuHeader>{title}</MenuHeader>
    {children}
  </MenuContainer>
);

export default Menu;
