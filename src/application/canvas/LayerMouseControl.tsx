import MouseControl, { MouseMode } from "./MouseControl";
import React, {
  FC,
  PropsWithChildren,
  useCallback,
  useRef,
  useState,
} from "react";
import { useUpdateScreenTranslation } from "../contexts/ScreenTranslationContext";

export type LayerMouseControlProps = PropsWithChildren<{
  mode: MouseMode;

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
  maxZoomFactor,
}) => {
  const [cursorMode, setCursorMode] = useState(mode);

  const mouseDownRef = useRef<false | [number, number]>(false);
  const mouseMoveDeltaRef = useRef<[number, number]>([0, 0]);

  const mouseDown = useCallback((event: React.MouseEvent) => {
    if ((event.target as HTMLElement).nodeName !== "CANVAS") return;
    const canvasPos = event.currentTarget.getBoundingClientRect();
    const elementX = event.pageX - canvasPos.left;
    const elementY = event.pageY - canvasPos.top;

    mouseDownRef.current = [elementX, elementY];
    mouseMoveDeltaRef.current = [0, 0];
  }, []);

  const screenUpdater = useUpdateScreenTranslation();

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
      screenUpdater((trans) => {
        const moveDeltaX = (deltaX - prevDeltaX) / trans.zoom;
        const moveDeltaY = (deltaY - prevDeltaY) / trans.zoom;
        if (handleDrag && handleDrag(event, moveDeltaX, moveDeltaY))
          return trans;

        const newPanX = Math.min(
          1.0,
          Math.max(
            trans.panX +
              (deltaX - prevDeltaX) / ((canvasPos.width * trans.zoom) / 2),
            -1.0
          )
        );

        const newPanY = Math.min(
          1.0,
          Math.max(
            trans.panY -
              (deltaY - prevDeltaY) / ((canvasPos.height * trans.zoom) / 2),
            -1.0
          )
        );

        return { ...trans, panX: newPanX, panY: newPanY };
      });
    },
    [handleDrag, screenUpdater, hoverCursor]
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
      screenUpdater((trans) => {
        const z = Math.min(
          maxZoomFactor,
          Math.max(0.1, trans.zoom - delta / 100)
        );
        return { ...trans, zoom: z };
      });
    },
    [screenUpdater, maxZoomFactor]
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
