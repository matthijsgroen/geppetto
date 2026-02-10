import type { FrameEvent } from "@geppetto/types";
import { useState } from "react";

import { TimePin } from "@/ui/components";

export const EventPin: React.FC<{
  event: FrameEvent;
  speed: number;
  zoom: number;
  selected?: boolean;
  onEventSelect?: () => void;
  onMoveEvent?: (newStart: number) => void;
}> = ({ event, speed, zoom, selected, onEventSelect, onMoveEvent }) => {
  const [editTime, setEditTime] = useState(event.start);
  const [isDragging, setIsDragging] = useState(false);

  const displayTime = isDragging ? editTime : event.start;

  return (
    <TimePin
      key={event.id}
      label={event.eventName}
      location={displayTime / 1000 / speed}
      onClick={() => {
        onEventSelect?.();
      }}
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
  );
};
