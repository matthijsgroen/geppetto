import {
  useEffect,
  useRef,
  useState,
  useCallback,
  PropsWithChildren,
} from "react";
import styled from "styled-components";

export enum MouseMode {
  Normal,
  Grab,
  Grabbing,
  Aim,
  Target,
}

type MouseControlProps = PropsWithChildren<{
  mode: MouseMode;
}>;

const MouseControlContainer = styled.div<MouseControlProps>`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  cursor: ${(props) =>
    ({
      [MouseMode.Grab]: "default",
      [MouseMode.Grabbing]: "move",
      [MouseMode.Normal]: "default",
      [MouseMode.Aim]: "crosshair",
      [MouseMode.Target]: "pointer",
    }[props.mode])};
  border: 1px solid ${(props) => props.theme.colors.controlEdge};

  &:focus {
    border-color: ${(props) => props.theme.colors.controlFocus};
  }
`;

interface MouseEventsProps {
  onMouseMove?: (event: React.MouseEvent<HTMLElement>) => void;
  onMouseDown?: (event: React.MouseEvent<HTMLElement>) => void;
  onMouseUp?: (event: React.MouseEvent<HTMLElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLElement>) => void;
  onWheel?: (delta: number) => void;
}

const MouseControl: React.FC<MouseControlProps & MouseEventsProps> = ({
  children,
  mode,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onWheel,
  onKeyDown,
}) => {
  const [isGrabbing, setIsGrabbing] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && onWheel) {
      const handler = (e: WheelEvent) => {
        e.preventDefault();
        onWheel(e.deltaY);
      };
      const elem = ref.current;
      elem.addEventListener("wheel", handler, { passive: false });

      return () => {
        elem.removeEventListener("wheel", handler);
      };
    }
  }, [ref, onWheel]);

  return (
    <MouseControlContainer
      ref={ref}
      mode={isGrabbing ? MouseMode.Grabbing : mode}
      tabIndex={0}
      onMouseDown={useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
          if (mode === MouseMode.Grab) {
            setIsGrabbing(true);
          }
          onMouseDown && onMouseDown(e);
        },
        [onMouseDown, mode]
      )}
      onMouseUp={useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
          setIsGrabbing(false);
          onMouseUp && onMouseUp(e);
        },
        [onMouseUp]
      )}
      onMouseMove={onMouseMove}
      onKeyDown={onKeyDown}
    >
      {children}
    </MouseControlContainer>
  );
};

export default MouseControl;
