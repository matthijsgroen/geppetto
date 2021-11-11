import React, { FunctionComponent, useRef } from "react";
import styled from "styled-components";

type Area = {
  id: string;
  top: number;
  left: number;
  bottom: number;
  right: number;
  onClick: () => void;
  cursor: string;
};

type Props = {
  width: number;
  height: number;
  onClick?: (percX: number, percY: number) => void;
  areas: Area[];
  allowFullscreen?: boolean;
};

const ClickableArea = styled.div<Omit<Area, "id">>`
  position: absolute;
  top: ${(props) => props.top * 100}%;
  right: ${(props) => (1 - props.right) * 100}%;
  bottom: ${(props) => (1 - props.bottom) * 100}%;
  left: ${(props) => props.left * 100}%;
  cursor: ${(props) => props.cursor};
`;

const ClickableContainer = styled.div<{ width: number; height: number }>`
  position: relative;
  width: min(${(props) => props.width}px, 100%);
  aspect-ratio: ${(props) => props.width / props.height};
  display: flex;
`;

const Centered = styled.div<{ width: number; height: number }>`
  position: relative;
  width: min(${(props) => props.width}px, 100%);
  aspect-ratio: ${(props) => props.width / props.height};
  align-self: center;
`;

const FullscreenButton = styled.button`
  position: absolute;
  bottom: 1em;
  left: 1em;
  cursor: pointer;
  background: transparent;
`;

const ClickableAreas: FunctionComponent<Props> = ({
  children,
  areas,
  width,
  height,
  onClick,
  allowFullscreen = false,
}) => {
  const containerRef = useRef<HTMLDivElement>();
  return (
    <ClickableContainer
      ref={containerRef}
      width={width}
      height={height}
      onClick={(event) => {
        const box = (event.target as HTMLDivElement).getBoundingClientRect();
        const position = [
          Math.min((event.pageX - box.left) / box.width, 1.0),
          Math.min((event.pageY - box.top) / box.height, 1.0),
        ];
        if (onClick) {
          onClick(position[0], position[1]);
        }
      }}
    >
      <Centered width={width} height={height}>
        {children}
        {areas.map(({ id, ...area }) => (
          <ClickableArea key={id} {...area} />
        ))}
      </Centered>
      {allowFullscreen && (
        <FullscreenButton
          title="Go fullscreen"
          onClick={() => {
            if (document.fullscreenElement) {
              document.exitFullscreen();
            } else containerRef.current.requestFullscreen();
          }}
        >
          📺
        </FullscreenButton>
      )}
    </ClickableContainer>
  );
};

export default ClickableAreas;
