import React, { useEffect, useRef, useState, useCallback } from "react";
import styled from "styled-components";

export enum MouseMode {
  Normal,
  Grab,
  Grabbing,
  Aim,
}

interface MouseControlProps {
  mode: MouseMode;
  width: number;
}

const MouseControlContainer = styled.div<MouseControlProps>`
  width: min(100%, ${(props) => props.width}px);
  height: 100%;
  cursor: ${(props) =>
    ({
      [MouseMode.Grab]: "grab",
      [MouseMode.Grabbing]: "grabbing",
      [MouseMode.Normal]: "default",
      [MouseMode.Aim]: "crosshair",
    }[props.mode])};
`;

interface MouseEventsProps {
  width: number;
  onMouseMove?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseDown?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseUp?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onWheel?: (delta: number) => void;
}

const MouseControl: React.FC<MouseControlProps & MouseEventsProps> = ({
  children,
  mode,
  width,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onWheel,
}) => {
  const [isGrabbing, setIsGrabbing] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && onWheel) {
      const handler = (e: WheelEvent) => {
        e.preventDefault();
        onWheel(e.deltaY);
      };
      ref.current.addEventListener("wheel", handler, { passive: false });
      return () => {
        ref.current?.removeEventListener("wheel", handler);
      };
    }
  }, [ref, onWheel]);

  return (
    <MouseControlContainer
      ref={ref}
      width={width}
      mode={isGrabbing ? MouseMode.Grabbing : mode}
      onMouseDown={useCallback(
        (e) => {
          if (mode === MouseMode.Grab) {
            setIsGrabbing(true);
          }
          onMouseDown && onMouseDown(e);
        },
        [onMouseDown]
      )}
      onMouseUp={useCallback(
        (e) => {
          setIsGrabbing(false);
          onMouseUp && onMouseUp(e);
        },
        [onMouseUp]
      )}
      onMouseMove={onMouseMove}
    >
      {children}
    </MouseControlContainer>
  );
};

export default MouseControl;
