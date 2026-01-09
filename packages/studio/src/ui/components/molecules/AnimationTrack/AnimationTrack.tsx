import { clsx } from "clsx";
import type { FC, PropsWithChildren } from "react";

import { TimeStretchHandle } from "@/ui/components/atoms/TimeBar/TimeStretchHandle";
import type { TimeStamp } from "@/ui/components/atoms/TimePin/TimePin";
import { Column } from "@/ui/components/molecules/Column/Column";
import { Row } from "@/ui/components/molecules/Row/Row";

import { AnimationTrackContext } from "./AnimationTrackContext";

export const AnimationTrack: FC<
  PropsWithChildren<{
    name: string;
    extraContent?: React.ReactNode;
    length?: TimeStamp;
    trackNames?: string[];
    selected?: boolean;
    loop?: boolean;
    onSelect?: () => void;
  }>
> = ({
  children,
  name,
  loop = false,
  length = 0,
  trackNames = [],
  selected = false,
  onSelect,
  extraContent,
}) => {
  const Element = selected ? "div" : "button";
  return (
    <>
      <div
        className={clsx(
          "sticky left-0 z-30 border-b border-control-edge text-right whitespace-nowrap backdrop-blur-md",
          selected ? "bg-control-active/80 pb-1" : "bg-toolbar/80 py-1"
        )}
      >
        <Column>
          <Row>
            <div
              className={clsx(
                "box-content h-5 flex-1 px-2 text-base text-text",
                selected && "pb-1"
              )}
            >
              {name}
            </div>
            {extraContent}
          </Row>
          {selected &&
            trackNames.map((trackName) => (
              <div
                className="h-5 cursor-grab px-2 pl-4 text-sm text-text hover:bg-control-highlight"
                key={trackName}
              >
                {trackName}
              </div>
            ))}
        </Column>
      </div>
      <Element
        className={clsx(
          "items-center border-b border-control-edge/50 bg-workspace last:rounded-b-control nth-[4]:rounded-t-control",
          !selected &&
            "group cursor-pointer hover:bg-control-highlight focus:z-10 focus:bg-control-highlight focus:outline-1 focus:outline-control-focus"
        )}
        onClick={() => {
          if (selected) return;
          onSelect?.();
        }}
      >
        <div className="relative flex h-full">
          <div className="flex w-min bg-panel/50">
            <div
              className={clsx(
                "box-content bg-panel ps-2 group-hover:bg-control-highlight group-focus:bg-control-highlight",
                selected ? "h-5 py-0.5" : "h-full"
              )}
              style={{ width: `${length}em` }}
            >
              <div
                className={clsx(
                  "rounded-sm bg-toolbar",
                  selected ? "h-4" : "h-0"
                )}
              ></div>
            </div>
            <div
              className={clsx(
                "flex w-2 items-start justify-end rounded-e-sm bg-panel pt-0.5 group-hover:bg-control-highlight group-focus:bg-control-highlight",
                selected ? "h-6" : "h-full"
              )}
            >
              {selected && <TimeStretchHandle />}
            </div>
          </div>
          {loop && <div className="px-2 text-sm text-dimmed">⏎</div>}
          <AnimationTrackContext.Provider value={{ activeTrack: selected }}>
            {children}
          </AnimationTrackContext.Provider>
        </div>
      </Element>
    </>
  );
};
