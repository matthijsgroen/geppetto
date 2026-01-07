import type { FC, PropsWithChildren } from "react";

export const AnimationsContainer: FC<
  PropsWithChildren<{ duration: number; zoom?: number; title?: string }>
> = ({ children, duration, zoom = 1, title }) => {
  return (
    <div className="overflow-scroll">
      <div
        className="grid grid-cols-[minmax(min-content,10vw)_1fr] gap-x-0.5"
        style={{ fontSize: `${zoom}rem` }}
      >
        <div className="sticky top-0 left-0 z-40 border-b border-control-edge bg-toolbar/70 p-2 text-right text-base text-text backdrop-blur-md">
          {title}
        </div>
        <div className="sticky top-0 z-30 box-content border-b border-control-edge bg-toolbar/70 px-2 py-2 text-base whitespace-nowrap text-text backdrop-blur-md">
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
