import React, { useState } from "react";
import styled from "styled-components";

interface MenuProps {
  title: string;
  items: React.ReactElement | React.ReactElement[];
  size?: "default" | "large" | "minimal";
  toolbarItems?: React.ReactElement | React.ReactElement[];
  collapsable?: boolean;
}

const MenuHeaderContainer = styled.header`
  background-color: ${({ theme }) => theme.colors.itemContainerBackground};
  width: 100%;
  box-sizing: border-box;
  padding: 0 2px;
  flex: 0;
`;

const MenuContainer = styled.div<{
  collapsed: boolean;
  size: MenuProps["size"];
}>`
  background-color: ${({ theme }) => theme.colors.itemContainerBackground};
  width: 100%;
  box-sizing: border-box;
  padding: 0 2px;
  flex: ${({ size }) =>
    size === "large" ? 2 : size === "minimal" ? "0 0 auto" : 1};
  overflow: auto;
  max-height: ${({ collapsed }) => (collapsed ? "0" : "100vh")};
`;

const MenuHeader = styled.div`
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.background};
  font-size: 14px;
  line-height: 20px;
  font-weight: normal;
  margin: 0;
  padding: 0 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.text};
  display: flex;
`;

const MenuTitle = styled.h1`
  color: ${({ theme }) => theme.colors.text};
  pointer-events: none;
  cursor: default;
  font-size: 14px;
  line-height: 20px;
  font-weight: normal;
  margin: 0;
  padding: 0.75rem 0;
  flex: 1;
`;

const CollapseButton = styled.button.attrs({ type: "button" })<{
  collapsed: boolean;
}>`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 50%;
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  outline: none;
  border: none;
  transform: rotate(${({ collapsed }) => (collapsed ? "0" : "180")}deg);
  flex: 0;
`;

const Toolbar = styled.div`
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.background};
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

const Menu: React.FC<MenuProps> = ({
  title,
  items,
  size = "default",
  toolbarItems = [],
  collapsable,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <>
      <MenuHeaderContainer>
        <MenuHeader>
          <MenuTitle>{title}</MenuTitle>
          {collapsable && (
            <CollapseButton
              collapsed={collapsed}
              onClick={() => setCollapsed((state) => !state)}
            >
              ↓
            </CollapseButton>
          )}
        </MenuHeader>
        {hasItems(toolbarItems) && !collapsed && (
          <Toolbar>{toolbarItems}</Toolbar>
        )}
      </MenuHeaderContainer>
      <MenuContainer collapsed={collapsed} size={size}>
        {items}
      </MenuContainer>
    </>
  );
};

export default Menu;
