import React, { useState } from "react";
import styled from "styled-components";
import { ToolBar } from "src/components/ToolBar";
import ToolbarButton from "./ToolbarButton";
import ToolbarSeperator from "./ToolbarSeperator";
import { ImageDefinition } from "src/lib/types";
import { makeAnimationName } from "src/lib/definitionHelpers";

const MainSection = styled.section`
  flex: 0 0 200px;
  height: 200px;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.itemContainerBackground};
`;

const MovingLineContainer = styled.div`
  height: calc(200px - 42px);
  position: relative;
  overflow: hidden;
`;

const MovingLine = styled.div.attrs<{ at: number; scale: number }>((props) => ({
  style: {
    left: `${250 + (props.at / 1000) * props.scale}px`,
  },
}))<{ at: number; scale: number }>`
  position: absolute;
  height: calc(200px - 42px);
  border-left: 2px solid white;
  z-index: 4;
  pointer-events: none;
`;

const TimeLineOuterContainer = styled.div`
  width: calc(100vw - 42px);
  height: calc(200px - 42px);

  overflow: auto;
`;

const TimeLineContainer = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  color: ${({ theme }) => theme.colors.text};
`;

const Label = styled.div<{ _isActive?: boolean }>`
  border-right: 2px solid
    ${({ theme, _isActive }) =>
      _isActive ? theme.colors.textSelected : theme.colors.backgroundSelected};
  background-color: ${({ theme, _isActive }) =>
    _isActive
      ? theme.colors.backgroundSelected
      : theme.colors.itemContainerBackground};
  color: ${({ theme, _isActive }) =>
    _isActive ? theme.colors.textSelected : theme.colors.text};
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
  _isActive?: boolean;
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
      ${({ theme, _isActive }) =>
        _isActive ? theme.colors.backgroundSelected : theme.colors.background},
      ${({ theme, _isActive }) =>
          _isActive ? theme.colors.backgroundSelected : theme.colors.background}
        ${(props) => props._scale * Math.round(props._length / 1000.0)}px,
      transparent
        ${(props) => props._scale * Math.round(props._length / 1000.0) + 1}px,
      transparent
        ${(props) => props._scale * Math.round(props._maxLength / 1000.0)}px
    );
`;

export const TimeContainer: React.VFC<{
  imageDefinition: ImageDefinition;
  updateImageDefinition(
    mutator: (previousImageDefinition: ImageDefinition) => ImageDefinition
  ): void;
}> = ({ imageDefinition, updateImageDefinition }) => {
  // const timelines = [
  //   { name: "Foo", keyframes: [2000] },
  //   { name: "Bar", keyframes: [1500, 6000] },
  //   { name: "Baz", keyframes: [] },
  //   { name: "Qux", keyframes: [] },
  //   { name: "Quuz", keyframes: [] },
  //   { name: "Lorem", keyframes: [] },
  //   { name: "Ipsum", keyframes: [] },
  //   { name: "Dolor", keyframes: [] },
  //   { name: "Sit", keyframes: [] },
  //   { name: "Amed", keyframes: [] },
  // ];

  const maxLength = imageDefinition.animations.reduce<number>(
    (result, e) =>
      Math.max(Math.max(0, ...e.keyframes.map((f) => f.time)), result),
    0
  );
  const [scale, setScale] = useState(100);
  const [mousePos, setMousePos] = useState(-1);
  const [activeAnimation, setActiveAnimation] = useState<string | null>(null);

  return (
    <MainSection>
      <ToolBar>
        <ToolbarButton
          icon="️⏱"
          label="+"
          hint="Add animation"
          onClick={() => {
            updateImageDefinition((image) => ({
              ...image,
              animations: image.animations.concat({
                name: makeAnimationName(image, "New Animation"),
                looping: false,
                keyframes: [],
              }),
            }));
          }}
        />
        <ToolbarSeperator />
        <ToolbarButton
          icon="▶️"
          label=""
          onClick={() => {
            /* oink */
          }}
        />
        <ToolbarButton
          icon="🔍"
          label="-"
          hint="Zoom out"
          onClick={() => {
            setScale((scale) => scale / 1.1);
          }}
        />
        <ToolbarButton
          icon="🔍"
          label="+"
          hint="Zoom in"
          onClick={() => {
            setScale((scale) => scale * 1.1);
          }}
        />
        <ToolbarSeperator />
        <ToolbarButton
          key="select"
          icon="✋"
          hint="Select mode"
          // active={mouseMode === MouseMode.Grab}
          label=""
          onClick={() => {
            // setMouseMode(MouseMode.Grab);
          }}
        />
        <ToolbarButton
          key="addPoints"
          icon="✏️"
          hint="Add keyframe mode"
          disabled={!activeAnimation}
          // active={mouseMode === MouseMode.Aim}
          label=""
          onClick={() => {
            // setMouseMode(MouseMode.Aim);
          }}
        />
      </ToolBar>
      <MovingLineContainer
        onMouseMove={(event) => {
          const lineX = event.pageX - 42 - 250;
          const time = (lineX / scale) * 1000;
          setMousePos(time);
        }}
        onMouseLeave={() => {
          setMousePos(-1);
        }}
      >
        {mousePos > 0 && imageDefinition.animations.length > 0 && (
          <MovingLine at={mousePos} scale={scale} />
        )}
        <TimeLineOuterContainer>
          <TimeLineContainer>
            <FloatHeader>&nbsp;</FloatHeader>
            <TimeHeader _scale={scale} _maxLength={maxLength}>
              <TimeScale>
                {new Array(Math.floor(Math.max(maxLength / 1000, 10)))
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
            {imageDefinition.animations.map((t, i) => (
              <React.Fragment key={i}>
                <Label
                  onClick={() =>
                    setActiveAnimation((activeAnimation) =>
                      activeAnimation === t.name ? null : t.name
                    )
                  }
                  _isActive={activeAnimation === t.name}
                >
                  {t.name}
                </Label>
                <TimeLine
                  _scale={scale}
                  _length={Math.max(0, ...t.keyframes.map((f) => f.time))}
                  _isActive={activeAnimation === t.name}
                  _maxLength={maxLength}
                >
                  {t.keyframes.map((f, i) => (
                    <FrameDot _pos={f.time / maxLength} key={i} />
                  ))}
                </TimeLine>
              </React.Fragment>
            ))}
          </TimeLineContainer>
        </TimeLineOuterContainer>
      </MovingLineContainer>
    </MainSection>
  );
};
