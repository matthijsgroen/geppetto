import React from "react";
import styled from "styled-components";
import { ToolBar } from "src/components/ToolBar";
import ToolbarButton from "./ToolbarButton";
import ToolbarSeperator from "./ToolbarSeperator";

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
  border-bottom: 2px solid
    ${({ theme }) => theme.colors.itemContainerBackground};
  line-height: 2rem;
  position: sticky;
  top: 0px;
  left: 0px;
  z-index: 2;
`;

const TimeHeader = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border-bottom: 2px solid
    ${({ theme }) => theme.colors.itemContainerBackground};
  line-height: 2rem;
  position: sticky;
  z-index: 1;
  top: 0px;
`;

const FrameDot = styled.div<{ pos: number }>`
  width: 1.2rem;
  height: 1.2rem;
  margin-left: -0.6rem;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  border: 1px solid ${({ theme }) => theme.colors.backgroundSelected};
  position: absolute;
  top: 0px;
  left: ${(props) => props.pos * 100}%;
`;

const TimeLine = styled.div<{ scale: number; length: number }>`
  width: ${(props) => Math.round((props.length / 1000.0) * props.scale)}px;
  height: 1.5rem;
  background: ${({ theme }) => theme.colors.background};
  border-bottom: 1px solid ${({ theme }) => theme.colors.backgroundSecondary};
  position: relative;
`;

export const TimeContainer: React.FC = () => {
  const timelines = [
    { name: "Foo", keyframes: [0.5], length: 4000 },
    { name: "Bar", keyframes: [0.2, 0.6], length: 8000 },
    { name: "Baz", keyframes: [], length: 0 },
    { name: "Qux", keyframes: [], length: 0 },
    { name: "Quuz", keyframes: [], length: 0 },
    { name: "Lorem", keyframes: [], length: 0 },
    { name: "Ipsum", keyframes: [], length: 0 },
    { name: "Dolor", keyframes: [], length: 0 },
    { name: "Sit", keyframes: [], length: 0 },
    { name: "Amed", keyframes: [], length: 0 },
  ];

  return (
    <MainSection>
      <ToolBar>
        <ToolbarButton
          icon="️⏱+"
          label=""
          onClick={() => {
            /* oink */
          }}
        />
        <ToolbarSeperator />
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
        <ToolbarButton
          icon="🔍"
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
              <TimeLine scale={100} length={t.length}>
                {t.keyframes.map((v, i) => (
                  <FrameDot pos={v} key={i} />
                ))}
              </TimeLine>
            </React.Fragment>
          ))}
        </TimeLineContainer>
      </TimeLineOuterContainer>
    </MainSection>
  );
};
