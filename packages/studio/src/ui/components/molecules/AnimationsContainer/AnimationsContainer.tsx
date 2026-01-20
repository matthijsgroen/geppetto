import type { FC, PropsWithChildren } from "react";
import { useEffect, useRef } from "react";

export const AnimationsContainer: FC<
  PropsWithChildren<{
    duration: number;
    zoom?: number;
    title?: string;
    onZoomChange?: (zoom: number) => void;
  }>
> = ({ children, duration, zoom = 1, title, onZoomChange }) => {
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

  return (
    <div className="overflow-scroll pb-4">
      <div
        className="grid min-w-fit grid-cols-[minmax(min-content,10vw)_1fr] gap-x-0.5"
        style={{ fontSize: `${zoom}rem` }}
      >
        <div className="sticky top-0 left-0 z-40 border-b border-control-edge bg-toolbar/70 p-2 text-right text-base text-text backdrop-blur-md">
          {title}
        </div>
        <div
          className="sticky top-0 z-30 box-content border-b border-control-edge bg-toolbar/70 px-2 py-2 text-base whitespace-nowrap text-text backdrop-blur-md"
          ref={timelineRef}
        >
          <div
            className="h-full timeline"
            style={{ width: `${duration}em`, fontSize: `${zoom}rem` }}
          ></div>
        </div>
        {children}
      </div>
    </div>
  );
};
