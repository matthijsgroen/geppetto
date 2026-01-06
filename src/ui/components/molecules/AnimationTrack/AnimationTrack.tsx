import { clsx } from "clsx";
import type { FC, PropsWithChildren } from "react";

import { Column } from "@/ui/components/molecules/Column/Column";

import { AnimationTrackContext } from "./AnimationTrackContext";

export const AnimationTrack: FC<
  PropsWithChildren<{
    name: string;
    trackNames?: string[];
    selected?: boolean;
    onSelect?: () => void;
  }>
> = ({ children, name, trackNames = [], selected = false, onSelect }) => {
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
          "items-center border-b border-control-edge/50 bg-panel px-2 last:rounded-b-control nth-[4]:rounded-t-control",
          {
            "cursor-pointer hover:bg-control-highlight": !selected,
          }
        )}
        onClick={() => {
          if (selected) return;
          onSelect?.();
        }}
      >
        <div className="relative h-full py-0.5">
          <div
            className={clsx("w-full rounded-sm bg-toolbar transition-all", {
              "h-4": selected,
              "h-0": !selected,
            })}
          ></div>
          <AnimationTrackContext.Provider value={{ activeTrack: selected }}>
            {children}
          </AnimationTrackContext.Provider>
        </div>
      </div>
    </>
  );
};
