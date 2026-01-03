import type { FC, PropsWithChildren } from "react";

export const AnimationsContainer: FC<
  PropsWithChildren<{ duration: number; zoom?: number }>
> = ({ children, duration, zoom = 1 }) => {
  return (
    <div className="overflow-scroll">
      <div className="grid grid-cols-[minmax(min-content,10vw)_1fr] gap-x-1">
        <div className="sticky top-0 left-0 z-40 border-b border-control-edge bg-toolbar/70 p-2 text-right backdrop-blur-md">
          Timeline
        </div>
        <div
          className="sticky top-0 z-30 border-b border-control-edge bg-toolbar/70 p-2 backdrop-blur-md"
          style={{ minWidth: `${duration}em` }}
        >
          {/* TODO: add lines for timeline, show timestamp */}
          Timestamps
        </div>
        {children}
      </div>
    </div>
  );
};
