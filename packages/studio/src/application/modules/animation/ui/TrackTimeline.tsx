import { MenuItem } from "@szhsin/react-menu";
import { type FC, type MouseEvent, useCallback, useState } from "react";

import { AnimationContextMenu } from "@/application/modules/animation/ui/AnimationContextMenu";
import useEvent from "@/application/state/hooks/useEvent";
import { TimeLineEndHandle, useMenuState } from "@/ui/components";
import type { TimeStamp } from "@/ui/components/support/timeDrag";
import { BASE_FONT_SIZE_PIXELS } from "@/ui/foundations/fontSize";

type TrackTimelineProps = {
  length: TimeStamp;
  looping: boolean;
  zoom: number;
  speed: number;
  trackIndex: number;
  onEndDrag?: (newTime: TimeStamp) => void;
  onAddFrame?: (time: TimeStamp) => void;
};

const round3 = (num: number): number => {
  return Math.round(num * 1000) / 1000;
};

export const TrackTimeline: FC<TrackTimelineProps> = ({
  length,
  looping,
  zoom,
  speed,
  trackIndex,
  onEndDrag,
  onAddFrame,
}) => {
  const [dragLength, setDragLength] = useState<null | number>(null);
  const displayLength = dragLength ?? length / 1000 / speed;

  const [animationTrackMenuProps, toggleAnimationTrackMenu] = useMenuState();
  const [anchorPoint, setAnchorPoint] = useState({
    x: 0,
    y: 0,
  });
  const [contextTimestamp, setContextTimestamp] = useState<number | null>(null);

  const handleAnimationTrackContextMenu = useEvent(
    (event: MouseEvent<HTMLElement>): void => {
      event.preventDefault();
      setAnchorPoint({
        x: event.clientX,
        y: event.clientY,
      });
      const relativeX =
        event.clientX -
        event.currentTarget.getBoundingClientRect().left -
        BASE_FONT_SIZE_PIXELS / 2;
      setContextTimestamp(
        round3(relativeX / BASE_FONT_SIZE_PIXELS / zoom / speed) * 1000
      );
      toggleAnimationTrackMenu(true);
    }
  );

  const handleAddFrame = useCallback(() => {
    onAddFrame?.(contextTimestamp ?? 0);
  }, [contextTimestamp, onAddFrame]);

  return (
    <>
      <AnimationContextMenu
        anchorPoint={anchorPoint}
        {...animationTrackMenuProps}
        onClose={() => toggleAnimationTrackMenu(false)}
      >
        {onAddFrame && <MenuItem onClick={handleAddFrame}>Add Frame</MenuItem>}
      </AnimationContextMenu>
      <TimeLineEndHandle
        location={displayLength}
        loop={looping}
        onContextMenu={handleAnimationTrackContextMenu}
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
    </>
  );
};
