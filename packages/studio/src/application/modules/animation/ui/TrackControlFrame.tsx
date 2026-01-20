import type { ControlDefinition, FrameControlAction } from "@geppetto/types";
import type { AnimationControlTrack } from "geppetto-player";
import { useState } from "react";

import { TimeBar } from "@/ui/components";

type TrackControlFrameProps = {
  action: FrameControlAction;
  actionIndex: number;
  control?: ControlDefinition;
  selected?: boolean;
  speed?: number;
  track: AnimationControlTrack;
  trackIndex: number;
  zoom?: number;

  onClick?: VoidFunction;
  onResize?: (newStart: number, newDuration: number) => void;
};

const ADJACENT_FRAME_GAP_MS = 200;

export const TrackControlFrame: React.FC<TrackControlFrameProps> = ({
  action,
  speed = 1,
  track,
  zoom = 1,
  actionIndex,
  trackIndex,
  control,
  onClick,
  onResize,
  selected,
}) => {
  const [dragStart, setDragStart] = useState<null | number>(null);
  const [dragEnd, setDragEnd] = useState<null | number>(null);

  const start = action.start / 1000 / speed;
  const duration = action.duration / 1000 / speed;

  const displayStart = dragStart ?? start;
  const displayDuration = dragEnd ?? duration;

  const nextItem = track.actions[actionIndex + 1];
  const maxEnd =
    nextItem !== undefined
      ? (nextItem.start + nextItem.duration - ADJACENT_FRAME_GAP_MS) /
        1000 /
        speed
      : Infinity;

  const previousItem = track.actions[actionIndex - 1];
  const minStart =
    previousItem !== undefined
      ? (previousItem.start + ADJACENT_FRAME_GAP_MS) / 1000 / speed
      : 0;

  // normalize control values
  const maxControlValue = control?.steps.length ?? 1;

  const startValue =
    (action.controlStartValue ?? previousItem?.controlEndValue ?? 0) /
    maxControlValue;
  const endValue = (action.controlEndValue ?? startValue) / maxControlValue;

  return (
    <TimeBar
      duration={displayDuration}
      easing={action.easingFunction}
      endValue={endValue}
      key={`${track.controlId}-${actionIndex}`}
      onClick={onClick}
      onEndDrag={(newTime) => {
        const newDragEnd = Math.min(
          Math.max(newTime - displayStart, 0.1),
          maxEnd - displayStart
        );

        setDragEnd(newDragEnd);
      }}
      onEndDragRelease={(newTime) => {
        if (onResize) {
          const newDragEnd = Math.min(
            Math.max(newTime - displayStart, 0.1),
            maxEnd - displayStart
          );
          const newLength = newDragEnd * 1000 * speed;
          onResize(action.start, newLength);
        }
        setDragEnd(null);
      }}
      onStartDrag={(newTime) => {
        const endTime = displayStart + displayDuration;

        const newDragStart = Math.max(
          Math.min(newTime, endTime - 0.1),
          minStart
        );

        const delta = start - newDragStart;
        setDragStart(newDragStart);
        setDragEnd(duration + delta);
      }}
      onStartDragRelease={(newTime) => {
        if (onResize) {
          const endTime = displayStart + displayDuration;

          const newDragStart = Math.max(
            Math.min(newTime, endTime - 0.1),
            minStart
          );

          const delta = start - newDragStart;
          onResize(
            newDragStart * 1000 * speed,
            (duration + delta) * 1000 * speed
          );
        }
        setDragStart(null);
        setDragEnd(null);
      }}
      selected={selected}
      start={displayStart}
      startValue={startValue}
      trackIndex={trackIndex}
      zoom={zoom}
    />
  );
};
