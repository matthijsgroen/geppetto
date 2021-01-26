import React from "react";
import styled from "styled-components";

const MenuContainer = styled.aside`
  flex: 0 0 250px;
  height: 100%;
`;

const MainContainer = styled.div`
  flex: 1 1 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Canvas = styled.div`
  flex: 1 1 100%;
  height: 100%;
`;

const ToolBar = styled.div`
  flex: 0;
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  padding: 0.2rem;
  display: flex;
  flex-direction: row;
`;

const hasTools = (tools?: React.ReactElement | React.ReactElement[]): boolean =>
  !!tools && ("length" in tools ? tools.length > 0 : true);

interface ScreenLayoutProps {
  menu?: React.ReactElement;
  tools?: React.ReactElement | React.ReactElement[];
  main?: React.ReactElement;
}

const ScreenLayout: React.FC<ScreenLayoutProps> = ({ menu, tools, main }) => (
  <>
    {menu && <MenuContainer>{menu}</MenuContainer>}
    <MainContainer>
      {hasTools(tools) && <ToolBar>{tools}</ToolBar>}
      <Canvas>{main}</Canvas>
    </MainContainer>
  </>
);

export default ScreenLayout;
