import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import ToolbarButton from "./ToolbarButton";
import ToolbarSeperator from "./ToolbarSeperator";
import { ImageDefinition, PlayStatus } from "src/lib/types";
import { makeAnimationName, omitKeys } from "src/lib/definitionHelpers";
import { Toolbar } from "./Toolbar";
import RenameableLabel from "./RenameableLabel";

const MainSection = styled.section`
  flex: 0 0 200px;
  height: 200px;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.itemContainerBackground};
`;

const MovingLineContainer = styled.div`
  height: 200px;
  position: relative;
  overflow: hidden;
`;

const MovingLine = styled.div.attrs<{ at: number; scale: number }>((props) => ({
  style: {
    left: `${250 + (props.at / 1000) * props.scale}px`,
  },
}))<{ at: number; scale: number }>`
  position: absolute;
  height: 200px;
  border-left: 2px solid white;
  z-index: 4;
  pointer-events: none;
`;

const TimeLineOuterContainer = styled.div`
  width: calc(100vw - 42px);
  height: 200px;
  overflow: auto;
`;

const TimeLineContainer = styled.div`
  display: grid;
  width: min-content;
  min-width: 100%;
  grid-template-columns: 250px 1fr;
  color: ${({ theme }) => theme.colors.text};
`;

const Label = styled.div<{ _isActive?: boolean }>`
  border-right: 1px solid
    ${({ theme, _isActive }) =>
      _isActive ? theme.colors.textSelected : theme.colors.backgroundSecondary};
  background-color: ${({ theme, _isActive }) =>
    _isActive
      ? theme.colors.backgroundSelected
      : theme.colors.itemContainerBackground};
  color: ${({ theme, _isActive }) =>
    _isActive ? theme.colors.textSelected : theme.colors.text};
  line-height: 1.5rem;
  position: sticky;
  left: 0px;
  z-index: 4;
  display: grid;
  grid-template-columns: 26px 1fr 26px;
`;

const TimelineButton = styled.button.attrs({ type: "button" })<{
  dimmed?: boolean;
}>`
  font-size: 1.2rem;
  padding: 0;
  background: transparent;
  border: none;
  outline: none;
  opacity: ${({ dimmed }) => (dimmed === true ? "0.3" : "1.0")};
  line-height: 1.3;
`;

const FloatHeader = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border-bottom: 2px solid
    ${({ theme }) => theme.colors.itemContainerBackground};
  line-height: 2rem;
  position: sticky;
  top: 0px;
  left: 0px;
  z-index: 5;
`;

const TimeHeader = styled.div<{
  _scale: number;
  _maxLength: number;
}>`
  border-top: 1px solid ${({ theme }) => theme.colors.backgroundSecondary};
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
  z-index: 4;
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

const FrameDot = styled.div<{
  _pos: number;
  selected?: boolean;
  _hasEvent: boolean;
}>`
  width: 1.2rem;
  height: 1.2rem;
  margin-left: -0.6rem;
  border-radius: 50%;
  background-color: ${({ theme, selected, _hasEvent }) =>
    _hasEvent
      ? selected
        ? theme.colors.itemSelected
        : theme.colors.itemSpecial
      : selected
      ? theme.colors.backgroundSelected
      : theme.colors.backgroundSecondary};
  border: 1px solid
    ${({ theme, selected }) =>
      selected ? theme.colors.textSelected : theme.colors.backgroundSelected};
  position: absolute;
  top: 0px;
  left: ${(props) => props._pos * 100}%;
`;

const TimeLoopAnimation = keyframes`  
  from { transform: translateX(0%); }
  to { transform: translateX(100%); }
`;

const TimeLinePlayer = styled.div<{
  max: number;
  duration: number;
  looping: boolean;
}>`
  position: absolute;
  top: 0px;
  z-index: 2;
  width: ${({ max }) => 100 * max}%;

  ::before {
    height: 1.4rem;
    border-left: 2px solid ${({ theme }) => theme.colors.backgroundSelected};
    animation-name: ${TimeLoopAnimation};
    animation-duration: ${({ duration }) => duration}ms;
    animation-play-state: running;
    animation-iteration-count: ${({ looping }) => (looping ? "infinite" : "1")};
    animation-timing-function: linear;

    display: block;
    color: transparent;
    content: "e";
  }
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
      ${({ theme }) => theme.colors.background},
      ${({ theme }) => theme.colors.background}
        ${(props) => props._scale * (props._length / 1000.0)}px,
      transparent ${(props) => props._scale * (props._length / 1000.0) + 1}px,
      transparent ${(props) => props._scale * (props._maxLength / 1000.0)}px
    );
`;

enum MouseMode {
  Default,
  AddKeyframe,
}

const EXTRA_SECONDS = 5;

export const TimeContainer: React.VFC<{
  imageDefinition: ImageDefinition;
  updateImageDefinition: Dispatch<SetStateAction<ImageDefinition>>;
  selectedAnimation: string | null;
  updateSelectedAnimation: Dispatch<SetStateAction<string | null>>;
  selectedFrame: number | null;
  updateSelectedFrame: Dispatch<SetStateAction<number | null>>;
  playStatus: PlayStatus;
  updatePlayStatus: Dispatch<SetStateAction<PlayStatus>>;
}> = ({
  imageDefinition,
  updateImageDefinition,
  selectedAnimation,
  updateSelectedAnimation,
  selectedFrame,
  updateSelectedFrame,
  playStatus,
  updatePlayStatus,
}) => {
  const maxLength = imageDefinition.animations.reduce<number>(
    (result, e) =>
      Math.max(Math.max(0, ...e.keyframes.map((f) => f.time)), result),
    0
  );
  const [scale, setScale] = useState(100);
  const [mousePos, setMousePos] = useState(-1);
  const [mouseMode, setMouseMode] = useState<MouseMode>(MouseMode.Default);

  useEffect(() => {
    if (selectedAnimation === null) {
      setMouseMode(MouseMode.Default);
    }
  }, [selectedAnimation]);

  return (
    <MainSection>
      <MovingLineContainer
        onMouseMove={(event) => {
          const lineX = event.pageX - 42 - 250;
          const time = (lineX / scale) * 1000;
          setMousePos(time);
        }}
        onMouseLeave={() => {
          setMousePos(-1);
        }}
        onClick={() => {
          if (selectedAnimation && mouseMode === MouseMode.AddKeyframe) {
            const time = Math.round(mousePos / 10) * 10;
            updateImageDefinition((image) => ({
              ...image,
              animations: image.animations.map((e) =>
                e.name === selectedAnimation
                  ? {
                      ...e,
                      keyframes: e.keyframes
                        .concat({
                          time,
                          controlValues: {},
                        })
                        .sort((a, b) => a.time - b.time),
                    }
                  : e
              ),
            }));
            setMouseMode(MouseMode.Default);
            updateSelectedFrame(time);
          }
        }}
      >
        {mousePos > 0 && imageDefinition.animations.length > 0 && (
          <MovingLine at={mousePos} scale={scale} />
        )}
        <TimeLineOuterContainer>
          <TimeLineContainer>
            <FloatHeader>
              <Toolbar>
                <ToolbarButton
                  icon="️⏱"
                  size={"small"}
                  label="+"
                  hint="Add animation"
                  onClick={() => {
                    const newName = makeAnimationName(
                      imageDefinition,
                      "New Animation"
                    );
                    updateImageDefinition((image) => ({
                      ...image,
                      animations: image.animations.concat({
                        name: newName,
                        looping: false,
                        keyframes: [],
                      }),
                    }));
                  }}
                />
                <ToolbarSeperator />
                <ToolbarButton
                  size="small"
                  icon="🔍"
                  label="-"
                  hint="Zoom out"
                  onClick={() => {
                    setScale((scale) => scale / 1.1);
                  }}
                />
                <ToolbarButton
                  size="small"
                  icon="🔍"
                  label="+"
                  hint="Zoom in"
                  onClick={() => {
                    setScale((scale) => scale * 1.1);
                  }}
                />
                <ToolbarSeperator />
                <ToolbarButton
                  size="small"
                  key="addPoints"
                  icon="✏️"
                  hint="Add keyframe mode"
                  disabled={!selectedAnimation}
                  active={mouseMode === MouseMode.AddKeyframe}
                  label=""
                  onClick={() => {
                    setMouseMode((mode) =>
                      mode === MouseMode.AddKeyframe
                        ? MouseMode.Default
                        : MouseMode.AddKeyframe
                    );
                  }}
                />
                <ToolbarButton
                  size="small"
                  key="remove"
                  icon="🗑"
                  hint="Remove timeline/frame"
                  label=""
                  disabled={!selectedAnimation}
                  onClick={() => {
                    if (!selectedAnimation) return;
                    if (selectedFrame !== null) {
                      updateImageDefinition((image) => ({
                        ...image,
                        animations: image.animations.map((e) =>
                          e.name === selectedAnimation
                            ? {
                                ...e,
                                keyframes: e.keyframes.filter(
                                  (f) => f.time !== selectedFrame
                                ),
                              }
                            : e
                        ),
                      }));
                      updateSelectedFrame(null);
                    } else {
                      updateImageDefinition((image) => ({
                        ...image,
                        animations: image.animations.filter(
                          (e) => e.name !== selectedAnimation
                        ),
                      }));
                      updateSelectedAnimation(null);
                      updateSelectedFrame(null);
                    }
                  }}
                />
              </Toolbar>
            </FloatHeader>
            <TimeHeader
              _scale={scale}
              _maxLength={maxLength + EXTRA_SECONDS * 1000}
            >
              <TimeScale>
                {new Array(Math.floor(maxLength / 1000 + EXTRA_SECONDS))
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
                  onClick={(e) => {
                    updateSelectedAnimation((activeAnimation) =>
                      activeAnimation === t.name ? null : t.name
                    );
                    e.stopPropagation();
                  }}
                  _isActive={selectedAnimation === t.name}
                >
                  <TimelineButton
                    onClick={(e) => {
                      e.stopPropagation();
                      if (playStatus[t.name]) {
                        updatePlayStatus((status) =>
                          omitKeys(status, [t.name])
                        );
                      } else {
                        updatePlayStatus((status) => ({
                          ...status,
                          [t.name]: {
                            startAt: 0,
                            startedAt: +new Date(),
                          },
                        }));
                      }
                    }}
                  >
                    {playStatus[t.name] ? "⏹" : "▶️"}
                  </TimelineButton>
                  <RenameableLabel
                    label={t.name}
                    allowRename={true}
                    onRename={(newName) => {
                      const finalName = makeAnimationName(
                        imageDefinition,
                        newName,
                        t.name
                      );
                      updateImageDefinition((image) => ({
                        ...image,
                        animations: image.animations.map((e) =>
                          e.name === t.name
                            ? {
                                ...e,
                                name: finalName,
                              }
                            : e
                        ),
                      }));
                      updateSelectedAnimation(finalName);
                    }}
                  />
                  <TimelineButton
                    dimmed={!t.looping}
                    onClick={(e) => {
                      e.stopPropagation();
                      updateImageDefinition((image) => ({
                        ...image,
                        animations: image.animations.map((e) =>
                          e.name === t.name ? { ...e, looping: !e.looping } : e
                        ),
                      }));
                    }}
                  >
                    🔁
                  </TimelineButton>
                </Label>
                <TimeLine
                  _scale={scale}
                  _length={Math.max(0, ...t.keyframes.map((f) => f.time))}
                  _isActive={selectedAnimation === t.name}
                  _maxLength={maxLength + EXTRA_SECONDS * 1000}
                >
                  {playStatus[t.name] && (
                    <TimeLinePlayer
                      max={
                        Math.max(0, ...t.keyframes.map((f) => f.time)) /
                        (maxLength + EXTRA_SECONDS * 1000)
                      }
                      duration={Math.max(0, ...t.keyframes.map((f) => f.time))}
                      looping={t.looping}
                    />
                  )}
                  {t.keyframes.map((f, i) => (
                    <FrameDot
                      selected={
                        selectedAnimation === t.name && selectedFrame === f.time
                      }
                      _pos={f.time / (maxLength + EXTRA_SECONDS * 1000)}
                      _hasEvent={!!f.event}
                      key={i}
                      onClick={() => {
                        updateSelectedFrame((time) =>
                          time === f.time && t.name === selectedAnimation
                            ? null
                            : f.time
                        );
                        updateSelectedAnimation(t.name);
                      }}
                    />
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
