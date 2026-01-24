import clsx from "clsx";
import type { FC, PropsWithChildren } from "react";
import { useCallback, useEffect, useRef } from "react";

type AnimationsContainerProps = PropsWithChildren<{
  /**
   * Total duration of the timeline (in seconds)
   */
  duration: number;
  zoom?: number;
  title?: string;
  showMomentMarker?: boolean;
  /**
   * Timestamp (in seconds) to display the moment marker at
   */
  momentTimestamp?: number;
  onZoomChange?: (zoom: number) => void;
  /**
   * Triggers when users performs a drag on the timeline
   * @param time time in seconds on dragging from timeline
   */
  onTimelineDrag?: (time: number) => void;
  /**
   * Triggers when users ends a drag on the timeline
   * @param time time in seconds on dragging from timeline
   */
  onTimelineDragRelease?: (time: number) => void;
}>;

const eventToTime = (
  clientX: number,
  rect: DOMRect,
  duration: number
): number => ((clientX - rect.left) / rect.width) * duration;

export const AnimationsContainer: FC<AnimationsContainerProps> = ({
  children,
  duration,
  zoom = 1,
  title,
  showMomentMarker = false,
  momentTimestamp = 0,
  onZoomChange,
  onTimelineDrag,
  onTimelineDragRelease,
}) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef(zoom);
  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  useEffect(() => {
    const el = timelineRef.current;
    if (!el || !onZoomChange) return;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      let newZoom = zoomRef.current;
      const zoomStep = newZoom > 1 ? 0.1 : 0.025;
      if (e.deltaY < 0) {
        newZoom = Math.min(newZoom + zoomStep, 12);
      } else if (e.deltaY > 0) {
        newZoom = Math.max(newZoom - zoomStep, 0.1);
      }
      if (newZoom !== zoomRef.current) {
        onZoomChange(newZoom);
      }
    };
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", handleWheel);
    };
  }, [onZoomChange]);

  const containerRef = useRef<HTMLDivElement>(null);
  const displayMomentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    const displayMomentEl = displayMomentRef.current;
    if (!el || !displayMomentEl) return;
    const updateSize = () => {
      const height = el.clientHeight;
      displayMomentEl.style.height = `${height - 8}px`;
    };
    updateSize();

    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(el);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const handleTimelineDrag = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const time = eventToTime(e.clientX, rect, duration);
      onTimelineDrag?.(time);

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const newTime = eventToTime(moveEvent.clientX, rect, duration);
        onTimelineDrag?.(newTime);
      };

      const handleMouseUp = (upEvent: MouseEvent) => {
        const finalTime = eventToTime(upEvent.clientX, rect, duration);
        onTimelineDragRelease?.(finalTime);
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    },

    [duration, onTimelineDrag, onTimelineDragRelease]
  );

  return (
    <div className="overflow-scroll pb-4">
      <div
        className="grid min-w-fit grid-cols-[minmax(min-content,10vw)_1fr] gap-x-0.5"
        ref={containerRef}
        style={{ fontSize: `${zoom}rem` }}
      >
        <div className="sticky top-0 left-0 z-40 border-b border-control-edge bg-toolbar/95 p-2 text-right text-base text-text backdrop-blur-md">
          {title}
        </div>
        <div
          className="sticky top-0 z-30 box-content border-b border-control-edge bg-toolbar/95 p-2 text-base whitespace-nowrap text-text backdrop-blur-md"
          ref={timelineRef}
        >
          <div
            className="h-full timeline"
            onMouseDown={handleTimelineDrag}
            style={{ width: `${duration}em`, fontSize: `${zoom}rem` }}
          ></div>
          <div
            className={clsx(
              "pointer-events-none absolute top-1 w-0.5 bg-control-active",
              !showMomentMarker && "hidden"
            )}
            ref={displayMomentRef}
            style={{
              left: `calc(${momentTimestamp}em + var(--spacing) * 2)`,
              fontSize: `${zoom}rem`,
            }}
          ></div>
        </div>
        {children}
      </div>
    </div>
  );
};
