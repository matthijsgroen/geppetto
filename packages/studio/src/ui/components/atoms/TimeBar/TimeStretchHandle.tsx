import type { FC, MouseEvent } from "react";
import { useCallback, useRef, useState } from "react";

import type { TimeStamp } from "@/ui/components/support/timeDrag";
import {
  calculateNewLocation,
  displayTime,
} from "@/ui/components/support/timeDrag";

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
