import { type FC, useState } from "react";

import { TimeLineEndHandle } from "@/ui/components";

type TrackTimelineProps = {
  length: number;
  looping: boolean;
  zoom: number;
  speed: number;
  trackIndex: number;
  onEndDrag?: (newTime: number) => void;
};

export const TrackTimeline: FC<TrackTimelineProps> = ({
  length,
  looping,
  zoom,
  speed,
  trackIndex,
  onEndDrag,
}) => {
  const [dragLength, setDragLength] = useState<null | number>(null);

  const displayLength = dragLength ?? length / 1000 / speed;

  return (
    <TimeLineEndHandle
      location={displayLength}
      loop={looping}
      onEndDrag={(newTime) => {
        setDragLength(newTime);
      }}
      onEndDragRelease={(newTime) => {
        if (onEndDrag) {
          const newLength = newTime * 1000 * speed;
          onEndDrag(newLength);
        }
        setDragLength(null);
      }}
      trackIndex={trackIndex}
      zoom={zoom}
    />
  );
};
