import { useEffect, useRef, useState, PropsWithChildren } from "react";
import styled from "styled-components";
import { Vec2 } from "../../types";
import useEvent from "../hooks/useEvent";

export enum MouseMode {
  Normal,
  Grab,
  Grabbing,
  Panning,
  Aim,
  Target,
}

type MouseControlProps = PropsWithChildren<{
  mode: MouseMode;
}>;

const MouseControlContainer = styled.div<{ $mode: MouseMode }>`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  cursor: ${(props) =>
    ({
      [MouseMode.Grab]: "grab",
      [MouseMode.Grabbing]: "grabbing",
      [MouseMode.Panning]: "move",
      [MouseMode.Normal]: "default",
      [MouseMode.Aim]: "crosshair",
      [MouseMode.Target]: "pointer",
    }[props.$mode])};
  border: 1px solid ${(props) => props.theme.colors.controlEdge};

  &:focus {
    border-color: ${(props) => props.theme.colors.controlFocus};
  }
`;

interface MouseEventsProps {
  onMouseMove?: (event: React.MouseEvent<HTMLElement>) => void;
  onMouseDown?: (event: React.MouseEvent<HTMLElement>) => void;
  onMouseUp?: (event: React.MouseEvent<HTMLElement>) => void;
  onContextMenu?: (event: React.MouseEvent<HTMLElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLElement>) => void;
  onKeyUp?: (event: React.KeyboardEvent<HTMLElement>) => void;
  onWheel?: (delta: number, position: Vec2, rect: DOMRect) => void;
}

const MouseControl: React.FC<MouseControlProps & MouseEventsProps> = ({
  children,
  mode,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onContextMenu,
  onWheel,
  onKeyDown,
  onKeyUp,
}) => {
  const [isGrabbing, setIsGrabbing] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && onWheel) {
      const elem = ref.current;
      const handler = (e: WheelEvent) => {
        e.preventDefault();
        onWheel(e.deltaY, [e.offsetX, e.offsetY], elem.getBoundingClientRect());
      };
      elem.addEventListener("wheel", handler, { passive: false });

      return () => {
        elem.removeEventListener("wheel", handler);
      };
    }
  }, [ref, onWheel]);

  const $mode =
    isGrabbing && mode === MouseMode.Normal
      ? MouseMode.Panning
      : isGrabbing && mode === MouseMode.Grab
      ? MouseMode.Grabbing
      : mode;

  return (
    <MouseControlContainer
      ref={ref}
      $mode={$mode}
      tabIndex={0}
      onMouseDown={useEvent((e: React.MouseEvent<HTMLDivElement>) => {
        setIsGrabbing(true);
        onMouseDown && onMouseDown(e);
      })}
      onMouseUp={useEvent((e: React.MouseEvent<HTMLDivElement>) => {
        setIsGrabbing(false);
        onMouseUp && onMouseUp(e);
      })}
      onMouseMove={onMouseMove}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      onContextMenu={onContextMenu}
    >
      {children}
    </MouseControlContainer>
  );
};

export default MouseControl;
