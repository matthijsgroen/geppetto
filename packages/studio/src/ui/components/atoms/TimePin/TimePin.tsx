import clsx from "clsx";
import {
  type FC,
  type MouseEvent,
  use,
  useCallback,
  useRef,
  useState,
} from "react";

import { AnimationTrackContext } from "@/ui/components/molecules/AnimationTrack/AnimationTrackContext";
import type { TimeStamp } from "@/ui/components/support/timeDrag";
import {
  calculateNewLocation,
  displayTime,
} from "@/ui/components/support/timeDrag";

export const TimePin: FC<{
  location: TimeStamp;
  activeTrack?: boolean;
  label?: string;
  zoom?: number;
  ref?: React.Ref<HTMLDivElement>;
  onClick?: () => void;
  onContextMenu?: (event: React.MouseEvent<HTMLElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  onDrag?: (newTime: TimeStamp) => void;
  onDragRelease?: (newTime: TimeStamp) => void;
}> = ({
  location,
  activeTrack,
  label,
  zoom = 1,
  ref,
  onClick,
  onContextMenu,
  onKeyDown,
  onDrag,
  onDragRelease,
}) => {
  const dragging = useRef(false);
  const startX = useRef(0);
  const lastDelta = useRef(0);
  const containerProps = use(AnimationTrackContext);
  const isActiveTrack = activeTrack ?? containerProps.activeTrack;
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
      aria-label={`${label ? label + " " : ""}${location}s`}
      className="absolute top-0.5 bottom-0.5 z-20 w-0 border-x border-dashed border-control-interaction"
      style={{ left: `calc(${location}em + 2 * var(--spacing))` }}
    >
      <div
        className={clsx(
          "relative rounded-full border border-control-edge bg-control-interaction",
          !isActiveTrack && "-ms-1 size-2",
          isActiveTrack && "-ms-2 size-4 hover:bg-control-highlight",
          !showTooltip && "cursor-pointer"
        )}
        onClick={onClick}
        onContextMenu={onContextMenu}
        onKeyDown={onKeyDown}
        onMouseDown={onMouseDown}
        ref={ref}
        title={`${label ? label + " " : ""}${location}s`}
      >
        {showTooltip && (
          <p className="absolute -bottom-10 -left-5 rounded-full bg-black px-2 py-1 text-xs whitespace-nowrap text-white">
            {displayTime(location)}
          </p>
        )}
      </div>
    </div>
  );
};
