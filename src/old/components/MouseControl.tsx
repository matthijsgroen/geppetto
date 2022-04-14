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
}

const MouseControlContainer = styled.div<MouseControlProps>`
  width: 100%;
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
  onMouseMove?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseDown?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseUp?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onWheel?: (delta: number) => void;
}

const MouseControl: React.FC<
  React.PropsWithChildren<MouseControlProps & MouseEventsProps>
> = ({ children, mode, onMouseDown, onMouseMove, onMouseUp, onWheel }) => {
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
      mode={isGrabbing ? MouseMode.Grabbing : mode}
      onMouseDown={useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
          if (mode === MouseMode.Grab) {
            setIsGrabbing(true);
          }
          onMouseDown && onMouseDown(e);
        },
        [onMouseDown]
      )}
      onMouseUp={useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
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
