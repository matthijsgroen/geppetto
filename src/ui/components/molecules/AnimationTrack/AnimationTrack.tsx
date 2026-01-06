import { clsx } from "clsx";
import type { FC, PropsWithChildren } from "react";

import { TimeStretchHandle } from "@/ui/components/atoms/TimeBar/TimeStretchHandle";
import type { TimeStamp } from "@/ui/components/atoms/TimePin/TimePin";
import { Column } from "@/ui/components/molecules/Column/Column";

import { AnimationTrackContext } from "./AnimationTrackContext";

export const AnimationTrack: FC<
  PropsWithChildren<{
    name: string;
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
}) => {
  return (
    <>
      <div
        className={clsx(
          "sticky left-0 z-30 border-b border-control-edge text-right whitespace-nowrap backdrop-blur-md",
          selected && "bg-control-active/80 pb-1",
          !selected && "bg-toolbar/80 py-1"
        )}
      >
        <Column>
          <div
            className={clsx(
              "box-content h-5 px-2 text-base text-text transition-all",
              {
                "pb-1": selected,
              }
            )}
          >
            {name}
          </div>
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
      <div
        className={clsx(
          "items-center border-b border-control-edge/50 bg-workspace last:rounded-b-control nth-[4]:rounded-t-control",
          {
            "cursor-pointer hover:bg-control-highlight": !selected,
          }
        )}
        onClick={() => {
          if (selected) return;
          onSelect?.();
        }}
      >
        <div className="relative flex h-full">
          <div className="flex w-min bg-panel/50">
            <div
              className={clsx("box-content bg-panel ps-2", {
                "h-5 py-0.5": selected,
                "h-full": !selected,
              })}
              style={{ width: `${length}em` }}
            >
              <div
                className={clsx("rounded-sm bg-toolbar transition-all", {
                  "h-4": selected,
                  "h-0": !selected,
                })}
              ></div>
            </div>
            <div
              className={clsx(
                "flex w-2 items-start justify-end rounded-e-sm bg-panel pt-0.5",
                {
                  "h-6": selected,
                  "h-full": !selected,
                }
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
      </div>
    </>
  );
};
