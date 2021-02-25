import React from "react";
import { ToolBar } from "src/components/ToolBar";
import styled from "styled-components";

const MenuContainer = styled.aside`
  flex: 0 0 250px;
  height: 100%;
  width: 250px;
  display: flex;
  flex-direction: column;
`;

const MainContainer = styled.div`
  flex: 1 1 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Canvas = styled.div`
  flex: 1 1 auto;
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
  <>
    {hasItems(menus) && <MenuContainer>{menus}</MenuContainer>}
    <MainContainer>
      {hasItems(tools) && <ToolBar>{tools}</ToolBar>}
      <Canvas>{main}</Canvas>
      {bottom}
    </MainContainer>
  </>
);

export default ScreenLayout;
