import React from "react";
import { ToolBar } from "src/components/ToolBar";
import styled from "styled-components";

const MenuContainer = styled.aside`
  grid-area: a;
  height: 100%;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
`;

const CanvasContainer = styled.div`
  grid-area: b;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Canvas = styled.div`
  flex: 1 1 auto;
`;

const Footer = styled.footer`
  grid-area: c;
  flex: 1 1 auto;
`;

const Main = styled.main`
  flex: 1 1 100%;
  display: grid;
  height: 100%;
  grid-template-areas: "a b" "c c";
  grid-template-rows: 1fr min-content;
  grid-template-columns: 250px 1fr;
`;

const hasItems = (tools?: React.ReactElement | React.ReactElement[]): boolean =>
  !!tools && ("length" in tools ? tools.length > 0 : true);

interface ScreenLayoutProps {
  menus?: React.ReactElement | React.ReactElement[];
  tools?: React.ReactElement | React.ReactElement[];
  main?: React.ReactElement;
  bottom?: React.ReactElement;
}

const ScreenLayout: React.FC<ScreenLayoutProps> = ({
  menus,
  tools,
  main,
  bottom,
}) => (
  <Main>
    {hasItems(menus) && <MenuContainer>{menus}</MenuContainer>}
    <CanvasContainer>
      {hasItems(tools) && <ToolBar>{tools}</ToolBar>}
      <Canvas>{main}</Canvas>
    </CanvasContainer>
    <Footer>{bottom}</Footer>
  </Main>
);

export default ScreenLayout;
