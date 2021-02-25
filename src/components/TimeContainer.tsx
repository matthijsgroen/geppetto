import React from "react";
import styled from "styled-components";
import { ToolBar } from "src/components/ToolBar";
import ToolbarButton from "./ToolbarButton";

const MainSection = styled.section`
  flex: 0 0 300px;
  height: 300px;
  background-color: ${({ theme }) => theme.colors.itemContainerBackground};
`;

export const TimeContainer: React.FC = () => (
  <MainSection>
    <ToolBar>
      <ToolbarButton
        icon="️⏮"
        label=""
        onClick={() => {
          /* oink */
        }}
      />
      <ToolbarButton
        icon="▶️"
        label=""
        onClick={() => {
          /* oink */
        }}
      />
      <ToolbarButton
        icon="⏭"
        label=""
        onClick={() => {
          /* oink */
        }}
      />
    </ToolBar>
  </MainSection>
);
