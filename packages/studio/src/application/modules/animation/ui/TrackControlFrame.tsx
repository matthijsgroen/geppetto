import type { ControlDefinition, FrameControlAction } from "@geppetto/types";
import type { AnimationControlTrack } from "geppetto-player";
import { useCallback, useState } from "react";

import { AnimationContextMenu } from "@/application/modules/animation/ui/AnimationContextMenu";
import { useActionMap } from "@/application/state/hooks/useActionMap";
import { useEvent } from "@/application/state/hooks/useEvent";
import { ActionMenuItem } from "@/application/ui/ActionMenuItem";
import { TimeBar, useMenuState } from "@/ui/components";

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
  onDelete?: VoidFunction;
  onResize?: (newStart: number, newDuration: number) => void;
};

const ADJACENT_FRAME_GAP_MS = 200;

export const TrackControlFrame: React.FC<TrackControlFrameProps> = ({
  action,
  actionIndex,
  control,
  selected,
  speed = 1,
  track,
  trackIndex,
  zoom = 1,
  onClick,
  onDelete,
  onResize,
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
  const maxControlValue = (control?.steps.length ?? 2) - 1;

  const startValue =
    (action.controlStartValue ?? previousItem?.controlEndValue ?? 0) /
    maxControlValue;
  const endValue = (action.controlEndValue ?? startValue) / maxControlValue;

  const [controlFrameMenuProps, toggleControlFrameMenu] = useMenuState();
  const [anchorPoint, setAnchorPoint] = useState({
    x: 0,
    y: 0,
  });

  const { triggerKeyboardAction, actions } = useActionMap(
    useCallback(
      () => ({
        deleteFrame: {
          caption: "Delete Frame",
          dangerous: true,
          shortcut: { interaction: "DelOrBackspace" as const },
          handler: () => {
            onDelete?.();
          },
        },
      }),
      [onDelete]
    )
  );

  const handleContextMenu = useEvent(
    (event: React.MouseEvent<HTMLElement>): void => {
      event.preventDefault();
      setAnchorPoint({
        x: event.clientX,
        y: event.clientY,
      });
      toggleControlFrameMenu(true);
    }
  );

  return (
    <>
      <AnimationContextMenu
        anchorPoint={anchorPoint}
        {...controlFrameMenuProps}
        onClose={() => toggleControlFrameMenu(false)}
      >
        <ActionMenuItem action={actions.deleteFrame} />
      </AnimationContextMenu>
      <TimeBar
        duration={displayDuration}
        easing={action.easingFunction}
        endValue={endValue}
        key={`${track.controlId}-${actionIndex}`}
        onClick={onClick}
        onContextMenu={handleContextMenu}
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
        onKeyDown={(e) => {
          if (triggerKeyboardAction(e)) {
            e.preventDefault();
          }
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
    </>
  );
};
