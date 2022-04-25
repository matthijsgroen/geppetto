import MouseControl, { MouseMode } from "./MouseControl";
import React, {
  FC,
  PropsWithChildren,
  useCallback,
  useRef,
  useState,
} from "react";
import { UseState } from "../types";

export type LayerMouseControlProps = PropsWithChildren<{
  mode: MouseMode;

  zoomState: UseState<number>;
  panXState: UseState<number>;
  panYState: UseState<number>;
  maxZoomFactor: number;

  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLElement>) => void;
  handleDrag?: (
    event: React.MouseEvent,
    deltaX: number,
    deltaY: number
  ) => boolean;
  hoverCursor?: (event: React.MouseEvent<HTMLElement>) => MouseMode;
}>;

const LayerMouseControl: FC<LayerMouseControlProps> = ({
  children,
  mode,
  handleDrag,
  onClick,
  onKeyDown,
  hoverCursor,
  zoomState,
  panXState,
  panYState,
  maxZoomFactor,
}) => {
  const [zoom, setZoom] = zoomState;
  const [panX, setPanX] = panXState;
  const [panY, setPanY] = panYState;
  const [cursorMode, setCursorMode] = useState(mode);

  const mouseDownRef = useRef<false | [number, number]>(false);
  const mouseMoveDeltaRef = useRef<[number, number]>([0, 0]);

  const mouseDown = useCallback((event: React.MouseEvent) => {
    const canvasPos = event.currentTarget.getBoundingClientRect();
    const elementX = event.pageX - canvasPos.left;
    const elementY = event.pageY - canvasPos.top;

    mouseDownRef.current = [elementX, elementY];
    mouseMoveDeltaRef.current = [0, 0];
  }, []);

  const zoomRef = useRef(zoom);
  const panXRef = useRef(panX);
  const panYRef = useRef(panY);

  const mouseMove = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (mouseDownRef.current && event.buttons === 0) {
        mouseDownRef.current = false;
      }
      if (!mouseDownRef.current) {
        // hovering
        if (hoverCursor) {
          setCursorMode(hoverCursor(event));
        }

        return;
      }

      const canvasPos = event.currentTarget.getBoundingClientRect();
      const elementX = event.pageX - canvasPos.left;
      const elementY = event.pageY - canvasPos.top;

      const [x, y] = mouseDownRef.current;
      const deltaX = elementX - x;
      const deltaY = elementY - y;
      const [prevDeltaX, prevDeltaY] = mouseMoveDeltaRef.current;
      mouseMoveDeltaRef.current = [deltaX, deltaY];

      const moveDeltaX = (deltaX - prevDeltaX) / zoomRef.current;
      const moveDeltaY = (deltaY - prevDeltaY) / zoomRef.current;
      if (handleDrag && handleDrag(event, moveDeltaX, moveDeltaY)) return;

      const newPanX = Math.min(
        1.0,
        Math.max(
          panXRef.current +
            (deltaX - prevDeltaX) / ((canvasPos.width * zoomRef.current) / 2),
          -1.0
        )
      );
      panXRef.current = newPanX;
      setPanX(newPanX);

      const newPanY = Math.min(
        1.0,
        Math.max(
          panYRef.current -
            (deltaY - prevDeltaY) / ((canvasPos.height * zoomRef.current) / 2),
          -1.0
        )
      );
      panYRef.current = newPanY;
      setPanY(newPanY);
    },
    [handleDrag, setPanX, setPanY, hoverCursor]
  );

  const mouseUp = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (onClick) {
        onClick(event);
      }
      mouseDownRef.current = false;
    },
    [onClick, mouseDownRef]
  );

  const mouseWheel = useCallback(
    (delta: number) => {
      const z = Math.min(
        maxZoomFactor,
        Math.max(0.1, zoomRef.current - delta / 100)
      );
      zoomRef.current = z;
      setZoom(z);
    },
    [setZoom, maxZoomFactor]
  );

  return (
    <MouseControl
      mode={cursorMode}
      onMouseDown={mouseDown}
      onMouseMove={mouseMove}
      onMouseUp={mouseUp}
      onWheel={mouseWheel}
      onKeyDown={onKeyDown}
    >
      {children}
    </MouseControl>
  );
};

export default LayerMouseControl;