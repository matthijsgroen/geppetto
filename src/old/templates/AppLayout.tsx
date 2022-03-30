import React from "react";
import styled from "styled-components";

interface AppLayoutProps {
  icons?: React.ReactElement;
  screen?: React.ReactElement;
}

const Main = styled.section`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
`;

const AppLayout: React.FC<AppLayoutProps> = ({ icons, screen }) => (
  <Main>
    {icons}
    {screen}
  </Main>
);

export default AppLayout;
