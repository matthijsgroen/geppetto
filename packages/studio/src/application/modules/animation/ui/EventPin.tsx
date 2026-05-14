import type { FrameEvent } from "@geppetto/types";
import { type MouseEvent, useState } from "react";

import { AnimationContextMenu } from "@/application/modules/animation/ui/AnimationContextMenu";
import useEvent from "@/application/state/hooks/useEvent";
import { MenuHeader, MenuItem, TimePin, useMenuState } from "@/ui/components";

export const EventPin: React.FC<{
  event: FrameEvent;
  speed: number;
  zoom: number;
  selected?: boolean;
  onEventSelect?: () => void;
  onMoveEvent?: (newStart: number) => void;
  onDeleteEvent?: () => void;
}> = ({
  event,
  speed,
  zoom,
  selected,
  onEventSelect,
  onMoveEvent,
  onDeleteEvent,
}) => {
  const [editTime, setEditTime] = useState(event.start);
  const [isDragging, setIsDragging] = useState(false);

  const displayTime = isDragging ? editTime : event.start;

  const [eventPinMenuProps, toggleEventPinMenu] = useMenuState();
  const [anchorPoint, setAnchorPoint] = useState({
    x: 0,
    y: 0,
  });

  const handleEventPinContextMenu = useEvent(
    (event: MouseEvent<HTMLElement>): void => {
      event.preventDefault();
      setAnchorPoint({
        x: event.clientX,
        y: event.clientY,
      });
      toggleEventPinMenu(true);
    }
  );
  return (
    <>
      <AnimationContextMenu
        anchorPoint={anchorPoint}
        {...eventPinMenuProps}
        onClose={() => toggleEventPinMenu(false)}
      >
        <MenuHeader>Animation Options</MenuHeader>
        {onDeleteEvent && (
          <MenuItem dangerous onClick={onDeleteEvent} type="checkbox">
            Delete Animation
          </MenuItem>
        )}
      </AnimationContextMenu>
      <TimePin
        key={event.id}
        label={event.eventName}
        location={displayTime / 1000 / speed}
        onClick={() => {
          onEventSelect?.();
        }}
        onContextMenu={handleEventPinContextMenu}
        onDrag={(newTime) => {
          setIsDragging(true);
          setEditTime(newTime * 1000 * speed);
        }}
        onDragRelease={(newTime) => {
          setIsDragging(false);
          const newStart = newTime * 1000 * speed;
          setEditTime(newStart);
          if (newStart !== event.start) {
            onMoveEvent?.(newStart);
          }
        }}
        selected={selected}
        zoom={zoom}
      />
    </>
  );
};
