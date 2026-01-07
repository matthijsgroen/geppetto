import MouseControl, { MouseMode } from "./MouseControl";
import React, {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useRef,
} from "react";

type State<T> = [T, Dispatch<SetStateAction<T>>];

const MAX_ZOOM_FACTOR = 4.0;
const MIN_ZOOM_FACTOR = 0.8;

export interface LayerMouseControlProps {
  mode: MouseMode;
  width: number;
  initialZoom: number;

  zoomState: State<number>;
  panXState: State<number>;
  panYState: State<number>;

  onClick?: (event: React.MouseEvent) => void;
  handleDrag?: (
    event: React.MouseEvent,
    deltaX: number,
    deltaY: number
  ) => boolean;
}

const LayerMouseControl: FC<LayerMouseControlProps> = ({
  children,
  mode,
  width,
  initialZoom,
  handleDrag,
  onClick,
  zoomState,
  panXState,
  panYState,
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
    setZoom((zoom) => {
      zoomRef.current = zoom;
      return zoom;
    });
    setPanX((panX) => {
      panXRef.current = panX;
      return panX;
    });
    setPanY((panY) => {
      panYRef.current = panY;
      return panY;
    });
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
            (((deltaX - prevDeltaX) / canvasPos.width) *
              window.devicePixelRatio) /
              zoomRef.current,
          -1.0
        )
      );
      setPanX(newPanX);
      panXRef.current = newPanX;

      const newPanY = Math.min(
        1.0,
        Math.max(
          panYRef.current +
            (((deltaY - prevDeltaY) / canvasPos.height) *
              window.devicePixelRatio *
              -1.0) /
              zoomRef.current,
          -1.0
        )
      );
      setPanY(newPanY);
      panYRef.current = newPanY;
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
        initialZoom * MAX_ZOOM_FACTOR,
        Math.max(initialZoom * MIN_ZOOM_FACTOR, zoomRef.current - delta / 100)
      );
      zoomRef.current = z;
      setZoom(z);
    },
    [setZoom, initialZoom]
  );

  return (
    <MouseControl
      mode={mode}
      width={width}
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
