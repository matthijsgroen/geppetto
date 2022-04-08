import React from "react";
import styled from "styled-components";
import { ToolbarContext } from "./ToolBarContext";

export type ToolBarSize = "default" | "small";

const ToolBarInner = styled.div<{ size: ToolBarSize }>`
  flex: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  min-width: fit-content;
  height: ${(props) => (props.size === "default" ? 3 : 2.25)}rem;

  padding: 0 0.2rem;
  > * + * {
    margin-left: 0.25rem;
  }
`;

const ToolBarOuter = styled.div<{ size: ToolBarSize }>`
  background-color: ${({ theme }) => theme.colors.controlDefault};
  height: ${(props) => (props.size === "default" ? 3 : 2.25)}rem;

  overflow-x: scroll;
  overflow-y: visible;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none;
  }
`;

type ToolBarProps = {
  size?: ToolBarSize;
};

export const ToolBar: React.FC<ToolBarProps> = ({
  children,
  size = "default",
}) => (
  <ToolbarContext.Provider value={size}>
    <ToolBarOuter size={size}>
      <ToolBarInner size={size}>{children}</ToolBarInner>
    </ToolBarOuter>
  </ToolbarContext.Provider>
);
