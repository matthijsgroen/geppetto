import { clsx } from "clsx";
import type { DragEvent, FC, MouseEvent, PropsWithChildren, Ref } from "react";
import { useState } from "react";

import { isEvent } from "@/ui/components";
import { TimeStretchHandle } from "@/ui/components/atoms/TimeBar/TimeStretchHandle";
import type { TimeStamp } from "@/ui/components/atoms/TimePin/TimePin";
import { Column } from "@/ui/components/molecules/Column/Column";
import { Row } from "@/ui/components/molecules/Row/Row";

import { AnimationTrackContext } from "./AnimationTrackContext";
import { useTrackDrag } from "./TrackDragContext";

type AnimationTrackProps = PropsWithChildren<{
  animationId?: string;
  extraContent?: React.ReactNode;
  length?: TimeStamp;
  loop?: boolean;
  name: React.ReactNode;
  onSelect?: () => void;
  onLabelContextMenu?: (event: MouseEvent<HTMLDivElement>) => void;
  onTrackNameContextMenu?: (
    event: MouseEvent<HTMLDivElement>,
    trackName: string
  ) => void;
  ref?: Ref<HTMLDivElement>;
  selected?: boolean;
  trackNames?: string[];
}>;

export const AnimationTrack: FC<AnimationTrackProps> = ({
  animationId = "",
  children,
  extraContent,
  length = 0,
  loop = false,
  name,
  onSelect,
  onLabelContextMenu,
  onTrackNameContextMenu,
  ref,
  selected = false,
  trackNames = [],
}) => {
  const trackDragContext = useTrackDrag();
  const [dragOverElement, setDragOverElement] = useState<string | null>(null);
  const [isValidDrop, setIsValidDrop] = useState(false);

  const handleTrackDragStart = (
    trackName: string,
    e: DragEvent<HTMLDivElement>
  ) => {
    if (!trackDragContext) return;

    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", trackName);

    trackDragContext.startDrag(trackName, animationId, e.clientX, e.clientY);
  };

  const handleTrackDrag = (e: DragEvent<HTMLDivElement>) => {
    if (!trackDragContext) return;
    if (e.clientX !== 0 && e.clientY !== 0) {
      trackDragContext.updateDragPosition(e.clientX, e.clientY);
    }
  };

  const handleTrackDragEnd = () => {
    if (!trackDragContext) return;
    trackDragContext.endDrag();
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    if (!trackDragContext?.dragState.draggedTrack) return;
    e.preventDefault();

    // Check if this animation already has a track with the same name
    const isDuplicate = trackNames.includes(
      trackDragContext.dragState.draggedTrack
    );
    const isValid =
      !isDuplicate &&
      trackDragContext.dragState.sourceAnimation !== animationId;
    // Set dropEffect for cursor feedback
    e.dataTransfer.dropEffect = isValid ? "move" : "none";

    setDragOverElement("animation-name");
    setIsValidDrop(isValid);
  };

  const handleDragLeave = () => {
    setDragOverElement(null);
    setIsValidDrop(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOverElement(null);
    setIsValidDrop(false);

    if (
      !trackDragContext ||
      !trackDragContext.dragState.draggedTrack ||
      !trackDragContext.dragState.sourceAnimation
    )
      return;

    // Prevent drop if track name already exists in target animation or same animation
    const isDuplicate = trackNames.includes(
      trackDragContext.dragState.draggedTrack
    );
    if (
      isDuplicate ||
      trackDragContext.dragState.sourceAnimation === animationId
    ) {
      trackDragContext.endDrag();
      return;
    }

    trackDragContext.onMove?.(
      {
        track: trackDragContext.dragState.draggedTrack,
        animation: trackDragContext.dragState.sourceAnimation,
      },
      { animation: animationId }
    );

    trackDragContext.endDrag();
  };

  return (
    <>
      <div
        className={clsx(
          "sticky left-0 z-30 border-b border-control-edge text-right whitespace-nowrap backdrop-blur-md",
          selected ? "pb-1" : "py-1",
          selected &&
            dragOverElement !== "animation-name" &&
            "bg-control-active/80",
          !selected && dragOverElement !== "animation-name" && "bg-toolbar/80",
          dragOverElement === "animation-name" &&
            isValidDrop &&
            "bg-control-highlight/80"
        )}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        ref={ref}
      >
        <Column>
          <Row>
            <div
              className={clsx(
                "box-content h-5 flex-1 px-2 text-base text-text",
                selected && "pb-1"
              )}
              onContextMenu={onLabelContextMenu}
            >
              {name}
            </div>
            {extraContent}
          </Row>
          {selected &&
            trackNames.map((trackName) => (
              <div
                className="h-5 cursor-grab px-2 pl-4 text-sm text-text hover:bg-control-highlight active:cursor-grabbing"
                draggable={!!trackDragContext}
                key={trackName}
                onContextMenu={(e) => {
                  onTrackNameContextMenu?.(e, trackName);
                }}
                onDrag={(e) => handleTrackDrag(e)}
                onDragEnd={handleTrackDragEnd}
                onDragStart={(e) => handleTrackDragStart(trackName, e)}
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
