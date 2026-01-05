import { clsx } from "clsx";
import type { FC, PropsWithChildren } from "react";

import { Column } from "@/ui/components/molecules/Column/Column";

import { AnimationTrackContext } from "./AnimationTrackContext";

export const AnimationTrack: FC<
  PropsWithChildren<{
    name: string;
    controlNames?: string[];
    selected?: boolean;
  }>
> = ({ children, name, controlNames = [], selected = false }) => {
  return (
    <>
      <div
        className={clsx(
          "sticky left-0 z-30 border-b border-control-edge px-2 text-right whitespace-nowrap backdrop-blur-md",
          selected && "bg-control-active/50 py-1",
          !selected && "bg-toolbar/50 py-2"
        )}
      >
        <Column>
          <div className={clsx("transition-all", selected ? "h-5" : "h-4")}>
            {name}
          </div>
          {selected &&
            controlNames.map((controlName) => (
              <div className="h-5 pl-4 text-sm" key={controlName}>
                {controlName}
              </div>
            ))}
        </Column>
      </div>
      <div className="relative items-center border-b border-control-edge/50 bg-panel px-1 py-0.5 last:rounded-b-control nth-[4]:rounded-t-control">
        {selected && <div className="h-4 w-full bg-toolbar"></div>}
        <AnimationTrackContext.Provider value={{ activeTrack: selected }}>
          {children}
        </AnimationTrackContext.Provider>
      </div>
    </>
  );
};
