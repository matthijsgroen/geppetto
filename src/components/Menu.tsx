import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Toolbar } from "./Toolbar";

interface MenuProps {
  title: string;
  items: React.ReactElement | React.ReactElement[];
  size?: "default" | "large" | "minimal" | "max";
  maxHeight?: number;
  toolbarItems?: React.ReactElement | React.ReactElement[];
  collapsable?: boolean;
  onExpand?: () => void;
  onCollapse?: () => void;
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
  maxHeight: MenuProps["maxHeight"];
}>`
  background-color: ${({ theme }) => theme.colors.itemContainerBackground};
  width: 100%;
  box-sizing: border-box;
  padding: 0 2px;
  flex: ${({ size }) =>
    size === "large"
      ? 2
      : size === "minimal" || size === "max"
      ? "0 0 auto"
      : 1};
  overflow: auto;
  max-height: ${({ collapsed, size, maxHeight }) =>
    collapsed ? "0" : size === "max" ? `${maxHeight}px` : "100vh"};
`;

const MenuHeader = styled.div`
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.background};
  font-size: 1rem;
  line-height: 1.5rem;
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
  font-size: 1rem;
  line-height: 1.5rem;
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

const hasItems = (items: React.ReactElement | React.ReactElement[]): boolean =>
  Array.isArray(items) ? items.length > 0 : !!items;

const Menu: React.VFC<MenuProps> = ({
  title,
  items,
  size = "default",
  maxHeight,
  toolbarItems = [],
  collapsable,
  onExpand,
  onCollapse,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    if (!collapsed && onExpand) {
      onExpand();
    }
    if (collapsed && onCollapse) {
      onCollapse();
    }
  }, [collapsed, onExpand, onCollapse]);

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
      <MenuContainer collapsed={collapsed} size={size} maxHeight={maxHeight}>
        {items}
      </MenuContainer>
    </>
  );
};

export default Menu;
