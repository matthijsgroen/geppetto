import MouseControl, { MouseMode } from "./MouseControl";
import React, { FC, PropsWithChildren, useCallback, useRef } from "react";
import { UseState } from "../types";

export type LayerMouseControlProps = PropsWithChildren<{
  mode: MouseMode;

  zoomState: UseState<number>;
  panXState: UseState<number>;
  panYState: UseState<number>;
  maxZoomFactor: number;

  onClick?: (event: React.MouseEvent) => void;
  handleDrag?: (
    event: React.MouseEvent,
    deltaX: number,
    deltaY: number
  ) => boolean;
}>;

const LayerMouseControl: FC<LayerMouseControlProps> = ({
  children,
  mode,
  handleDrag,
  onClick,
  zoomState,
  panXState,
  panYState,
  maxZoomFactor,
}) => {
  const [zoom, setZoom] = zoomState;
  const [panX, setPanX] = panXState;
  const [panY, setPanY] = panYState;

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
    (event: React.MouseEvent) => {
      if (!mouseDownRef.current) return;

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
            ((deltaX - prevDeltaX) /
              ((canvasPos.width * zoomRef.current) / 2)) *
              window.devicePixelRatio,
          -1.0
        )
      );
      panXRef.current = newPanX;
      setPanX(newPanX);

      const newPanY = Math.min(
        1.0,
        Math.max(
          panYRef.current -
            ((deltaY - prevDeltaY) /
              ((canvasPos.height * zoomRef.current) / 2)) *
              window.devicePixelRatio,
          -1.0
        )
      );
      panYRef.current = newPanY;
      setPanY(newPanY);
    },
    [handleDrag, setPanX, setPanY]
  );

  const mouseUp = useCallback(
    (event: React.MouseEvent) => {
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
      mode={mode}
      onMouseDown={mouseDown}
      onMouseMove={mouseMove}
      onMouseUp={mouseUp}
      onWheel={mouseWheel}
    >
      {children}
    </MouseControl>
  );
};

export default LayerMouseControl;
