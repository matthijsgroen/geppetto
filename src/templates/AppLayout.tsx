import React from "react";
import styled from "styled-components";

interface AppLayoutProps {
  menu?: React.ReactElement;
  main?: React.ReactElement;
}

const Main = styled.section`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
`;

const MenuContainer = styled.aside`
  flex: 0 0 250px;
  height: 100%;
`;

const MainContainer = styled.div`
  flex: 1 1 100%;
  height: 100%;
`;

const AppLayout: React.FC<AppLayoutProps> = ({ menu, main }) => (
  <Main>
    <MenuContainer>{menu}</MenuContainer>
    <MainContainer>{main}</MainContainer>
  </Main>
);

export default AppLayout;
