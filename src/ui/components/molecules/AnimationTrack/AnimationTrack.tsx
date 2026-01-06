import { clsx } from "clsx";
import type { FC, PropsWithChildren } from "react";

import { Column } from "@/ui/components/molecules/Column/Column";

import { AnimationTrackContext } from "./AnimationTrackContext";

export const AnimationTrack: FC<
  PropsWithChildren<{
    name: string;
    controlNames?: string[];
    selected?: boolean;
    onSelect?: () => void;
  }>
> = ({ children, name, controlNames = [], selected = false, onSelect }) => {
  return (
    <>
      <div
        className={clsx(
          "sticky left-0 z-30 border-b border-control-edge px-2 text-right whitespace-nowrap backdrop-blur-md",
          selected && "bg-control-active/50 pb-1",
          !selected && "bg-toolbar/50 py-1"
        )}
      >
        <Column>
          <div
            className={clsx(
              "box-content h-5 text-base text-text transition-all",
              {
                "pb-1": selected,
              }
            )}
          >
            {name}
          </div>
          {selected &&
            controlNames.map((controlName) => (
              <div className="h-5 pl-4 text-sm text-text" key={controlName}>
                {controlName}
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
