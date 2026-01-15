import { clsx } from "clsx";
import type { FC, MouseEvent, PropsWithChildren, Ref } from "react";

import { isEvent } from "@/ui/components";
import { TimeStretchHandle } from "@/ui/components/atoms/TimeBar/TimeStretchHandle";
import type { TimeStamp } from "@/ui/components/atoms/TimePin/TimePin";
import { Column } from "@/ui/components/molecules/Column/Column";
import { Row } from "@/ui/components/molecules/Row/Row";

import { AnimationTrackContext } from "./AnimationTrackContext";

type AnimationTrackProps = PropsWithChildren<{
  extraContent?: React.ReactNode;
  length?: TimeStamp;
  loop?: boolean;
  name: React.ReactNode;
  onSelect?: () => void;
  onLabelContextMenu?: (
    event: MouseEvent<HTMLDivElement>,
    trackName: string
  ) => void;
  ref?: Ref<HTMLDivElement>;
  selected?: boolean;
  trackNames?: string[];
}>;

export const AnimationTrack: FC<AnimationTrackProps> = ({
  children,
  extraContent,
  length = 0,
  loop = false,
  name,
  onSelect,
  onLabelContextMenu,
  ref,
  selected = false,
  trackNames = [],
}) => {
  return (
    <>
      <div
        className={clsx(
          "sticky left-0 z-30 border-b border-control-edge text-right whitespace-nowrap backdrop-blur-md",
          selected ? "bg-control-active/80 pb-1" : "bg-toolbar/80 py-1"
        )}
        ref={ref}
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
                onContextMenu={(e) => {
                  onLabelContextMenu?.(e, trackName);
                }}
              >
                {trackName}
              </div>
            ))}
        </Column>
      </div>
      <div
        className={clsx(
          "items-center border-b border-control-edge/50 bg-workspace last:rounded-b-control nth-[4]:rounded-t-control",
          !selected &&
            "group cursor-pointer hover:bg-control-highlight focus:z-10 focus:bg-control-highlight focus:outline-1 focus:outline-control-focus",
          selected && "focus:outline-0"
        )}
        key="track"
        onClick={() => {
          if (selected) return;
          onSelect?.();
        }}
        onKeyDown={(event) => {
          if (isEvent({ interaction: "Enter" }, event)) {
            if (selected) return;
            onSelect?.();
          }
        }}
        role={selected ? "region" : "button"}
        tabIndex={selected ? -1 : 0}
      >
        <div className="relative flex h-full">
          <div
            className="absolute top-0 bottom-0 box-content flex w-min bg-panel/50 ps-2"
            style={{ width: `${length}em` }}
          ></div>
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
          {loop && <div className="px-2 text-sm text-dimmed">⏎</div>}
          <AnimationTrackContext.Provider value={{ activeTrack: selected }}>
            {children}
          </AnimationTrackContext.Provider>
        </div>
      </div>
    </>
  );
};
