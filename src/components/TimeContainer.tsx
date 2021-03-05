import React, { useState } from "react";
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

const TimeHeader = styled.div<{
  _scale: number;
  _maxLength: number;
}>`
  background-color: ${({ theme }) => theme.colors.background};
  background-image: repeating-linear-gradient(
    90deg,
    transparent,
    transparent ${(props) => props._scale - 1}px,
    ${({ theme }) => theme.colors.backgroundSecondary}
      ${(props) => props._scale - 1}px,
    ${({ theme }) => theme.colors.backgroundSecondary}
      ${(props) => props._scale}px
  );
  border-bottom: 2px solid
    ${({ theme }) => theme.colors.itemContainerBackground};
  line-height: 2rem;
  position: sticky;
  z-index: 1;
  top: 0px;
`;

const TimeScale = styled.div`
  position: relative;
`;

const TimeDot = styled.div`
  position: absolute;
  top: 0px;
  width: 40px;
  text-align: right;
`;

const FrameDot = styled.div<{ _pos: number }>`
  width: 1.2rem;
  height: 1.2rem;
  margin-left: -0.6rem;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  border: 1px solid ${({ theme }) => theme.colors.backgroundSelected};
  position: absolute;
  top: 0px;
  left: ${(props) => props._pos * 100}%;
`;

const TimeLine = styled.div<{
  _scale: number;
  _length: number;
  _maxLength: number;
}>`
  width: ${(props) => Math.round((props._maxLength / 1000.0) * props._scale)}px;
  height: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.backgroundSecondary};
  position: relative;
  background-image: repeating-linear-gradient(
      90deg,
      transparent,
      transparent ${(props) => props._scale - 1}px,
      ${({ theme }) => theme.colors.backgroundSecondary}
        ${(props) => props._scale - 1}px,
      ${({ theme }) => theme.colors.backgroundSecondary}
        ${(props) => props._scale}px
    ),
    linear-gradient(
      90deg,
      ${({ theme }) => theme.colors.background},
      ${({ theme }) => theme.colors.background}
        ${(props) => props._scale * Math.round(props._length / 1000.0)}px,
      transparent
        ${(props) => props._scale * Math.round(props._length / 1000.0) + 1}px,
      transparent
        ${(props) => props._scale * Math.round(props._maxLength / 1000.0)}px
    );
`;

export const TimeContainer: React.FC = () => {
  const timelines = [
    { name: "Foo", keyframes: [2000] },
    { name: "Bar", keyframes: [1500, 6000] },
    { name: "Baz", keyframes: [] },
    { name: "Qux", keyframes: [] },
    { name: "Quuz", keyframes: [] },
    { name: "Lorem", keyframes: [] },
    { name: "Ipsum", keyframes: [] },
    { name: "Dolor", keyframes: [] },
    { name: "Sit", keyframes: [] },
    { name: "Amed", keyframes: [] },
  ];

  const maxLength = timelines.reduce<number>(
    (result, e) => Math.max(Math.max(0, ...e.keyframes), result),
    0
  );
  const [scale, setScale] = useState(100);

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
          label="-"
          onClick={() => {
            setScale((scale) => scale / 1.1);
          }}
        />
        <ToolbarButton
          icon="🔍"
          label="+"
          onClick={() => {
            setScale((scale) => scale * 1.1);
          }}
        />
      </ToolBar>
      <TimeLineOuterContainer>
        <TimeLineContainer>
          <FloatHeader>(empty)</FloatHeader>
          <TimeHeader _scale={scale} _maxLength={maxLength}>
            <TimeScale>
              {new Array(Math.floor(maxLength / 1000))
                .fill(null)
                .map((_e, i) => (
                  <TimeDot
                    style={{ left: Math.round(scale * (i + 1) - 40) }}
                    key={i}
                  >
                    {i + 1}s
                  </TimeDot>
                ))}
            </TimeScale>
          </TimeHeader>
          {timelines.map((t, i) => (
            <React.Fragment key={i}>
              <Label>{t.name}</Label>
              <TimeLine
                _scale={scale}
                _length={Math.max(0, ...t.keyframes)}
                _maxLength={maxLength}
              >
                {t.keyframes.map((v, i) => (
                  <FrameDot _pos={v / maxLength} key={i} />
                ))}
              </TimeLine>
            </React.Fragment>
          ))}
        </TimeLineContainer>
      </TimeLineOuterContainer>
    </MainSection>
  );
};
