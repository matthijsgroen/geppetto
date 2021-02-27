import React from "react";
import styled from "styled-components";
import { ToolBar } from "src/components/ToolBar";
import ToolbarButton from "./ToolbarButton";

const MainSection = styled.section`
  flex: 0 0 200px;
  height: 200px;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.itemContainerBackground};
`;

const TimeLineOuterContainer = styled.div`
  width: calc(100vw - 42px);
  height: fit-content;

  overflow: auto;
`;

const TimeLineContainer = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  color: ${({ theme }) => theme.colors.text};
`;

const Label = styled.div`
  border-right: 2px solid ${({ theme }) => theme.colors.backgroundSelected};
  background-color: ${({ theme }) => theme.colors.itemContainerBackground};
  line-height: 1.5rem;
  position: sticky;
  left: 0px;
  z-index: 1;
`;

const FloatHeader = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  line-height: 2rem;
  position: sticky;
  top: 0px;
  left: 0px;
  z-index: 2;
`;

const TimeHeader = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  line-height: 2rem;
  position: sticky;
  top: 0px;
`;

const TimeLine = styled.div`
  width: 1200px;
  height: 1em;
  border-bottom: 1px solid red;
`;

export const TimeContainer: React.FC = () => {
  const timelines = [
    { name: "Foo" },
    { name: "Bar" },
    { name: "Baz" },
    { name: "Qux" },
    { name: "Quuz" },
    { name: "Lorem" },
    { name: "Ipsum" },
    { name: "Dolor" },
    { name: "Sit" },
    { name: "Amed" },
  ];

  return (
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
      <TimeLineOuterContainer>
        <TimeLineContainer>
          <FloatHeader>(empty)</FloatHeader>
          <TimeHeader>(timeline) ...</TimeHeader>
          {timelines.map((t, i) => (
            <React.Fragment key={i}>
              <Label>{t.name}</Label>
              <TimeLine></TimeLine>
            </React.Fragment>
          ))}
        </TimeLineContainer>
      </TimeLineOuterContainer>
    </MainSection>
  );
};
