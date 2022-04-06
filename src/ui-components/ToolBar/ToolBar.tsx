import React from "react";
import styled from "styled-components";

const ToolBarInner = styled.div`
  flex: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  min-width: fit-content;

  padding: 0 0.2rem;
  > * + * {
    margin-left: 0.25rem;
  }
`;

const ToolBarOuter = styled.div`
  background-color: ${({ theme }) => theme.colors.controlDefault};
  height: 3rem;

  overflow-x: scroll;
  overflow-y: visible;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const ToolBar: React.FC = ({ children }) => (
  <ToolBarOuter>
    <ToolBarInner>{children}</ToolBarInner>
  </ToolBarOuter>
);
