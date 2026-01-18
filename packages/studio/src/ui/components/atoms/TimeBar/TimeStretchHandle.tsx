import type { FC, MouseEvent } from "react";
import { useCallback, useRef, useState } from "react";

import type { TimeStamp } from "@/ui/components/atoms/TimePin/TimePin";
import { BASE_FONT_SIZE_PIXELS } from "@/ui/foundations/fontSize";

export type StepSize =
  | "default"
  | "extraSmall"
  | "small"
  | "large"
  | "extraLarge";

const getStepSize = (e: globalThis.MouseEvent): StepSize => {
  if (e.altKey && e.shiftKey) return "extraSmall";
  if (e.altKey) return "small";
  if (e.ctrlKey || e.metaKey) return "extraLarge";
  if (e.shiftKey) return "large";
  return "default";
};

const calculateNewLocation = (
  initialLocation: number,
  initialTime: TimeStamp,
  e: globalThis.MouseEvent,
  zoom: number
): TimeStamp => {
  const stepSize = getStepSize(e);

  const deltaPx = e.clientX - initialLocation;
  const deltaTime = deltaPx / (BASE_FONT_SIZE_PIXELS * zoom);
  let newTime = initialTime + deltaTime;
  const stepSizes: Record<string, number> = {
    extraSmall: 0.1,
    small: 0.2,
    default: 0,
    large: 0.5,
    extraLarge: 1,
  };
  const step = stepSizes[stepSize] ?? 0;
  if (step > 0) {
    newTime = Math.round(newTime / step) * step;
  }
  return newTime;
};

const displayTime = (time: TimeStamp): string => {
  if (time < 1) {
    return `${Math.round(time * 1000)} ms`;
  } else {
    return `${time.toFixed(2)} s`;
  }
};

export const TimeStretchHandle: FC<{
  ref?: React.Ref<HTMLDivElement>;
  location: TimeStamp;
  zoom?: number;
  onDrag?: (newLocation: TimeStamp) => void;
  onDragRelease?: (newLocation: TimeStamp) => void;
}> = ({ ref, onDrag, onDragRelease, location, zoom = 1 }) => {
  const dragging = useRef(false);
  const startX = useRef(0);
  const lastDelta = useRef(0);
  const [showTooltip, setShowTooltip] = useState(false);

  const onMouseDown = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      dragging.current = true;
      startX.current = e.clientX;
      lastDelta.current = 0;
      document.body.style.cursor = "ew-resize";
      setShowTooltip(true);

      const onMouseMove = (e: globalThis.MouseEvent) => {
        if (!dragging.current) return;
        if (onDrag) {
          const newTime = calculateNewLocation(
            startX.current,
            location,
            e,
            zoom
          );
          onDrag(newTime);
        }
      };

      const onMouseUp = (e: globalThis.MouseEvent) => {
        if (onDragRelease) {
          const newTime = calculateNewLocation(
            startX.current,
            location,
            e,
            zoom
          );
          onDragRelease(newTime);
        }
        dragging.current = false;
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
        lastDelta.current = 0;
        document.body.style.cursor = "";
        setShowTooltip(false);
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
      e.preventDefault();
    },
    [onDrag, onDragRelease, location, zoom]
  );

  return (
    <div
      className="relative h-4 w-1 cursor-ew-resize border-x border-control-interaction hover:bg-control-active"
      onMouseDown={onMouseDown}
      ref={ref}
    >
      {showTooltip && (
        <p className="absolute -top-8 -left-5 rounded-full bg-black px-2 py-1 text-xs whitespace-nowrap text-white">
          {displayTime(location)}
        </p>
      )}
    </div>
  );
};
