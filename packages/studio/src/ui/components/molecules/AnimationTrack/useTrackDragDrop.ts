import type { DragEvent } from "react";
import { useState } from "react";

import { useTrackDrag } from "./TrackDragContext";

type DragDropHandlers = {
  handleTrackDragStart: (
    trackName: string,
    e: DragEvent<HTMLDivElement>
  ) => void;
  handleTrackDrag: (e: DragEvent<HTMLDivElement>) => void;
  handleTrackDragEnd: () => void;
  handleDragOver: (e: DragEvent<HTMLDivElement>) => void;
  handleDragLeave: () => void;
  handleTrackDragOver: (
    trackIndex: number,
    e: DragEvent<HTMLDivElement>
  ) => void;
  handleTrackDragLeave: (trackIndex: number) => void;
  handleTrackDrop: (trackIndex: number, e: DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: DragEvent<HTMLDivElement>) => void;
  dragOverElement: string | null;
  isValidDrop: boolean;
  dropPosition: "before" | "after" | null;
};

export const useTrackDragDrop = (
  animationId: string,
  trackNames: string[]
): DragDropHandlers => {
  const trackDragContext = useTrackDrag();
  const [dragOverElement, setDragOverElement] = useState<string | null>(null);
  const [isValidDrop, setIsValidDrop] = useState(false);
  const [_dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);
  const [dropPosition, setDropPosition] = useState<"before" | "after" | null>(
    null
  );

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
    setDropTargetIndex(null);
    setDropPosition(null);
  };

  const handleTrackDragOver = (
    trackIndex: number,
    e: DragEvent<HTMLDivElement>
  ) => {
    if (!trackDragContext?.dragState.draggedTrack) return;
    e.preventDefault();
    e.stopPropagation();

    const isSameAnimation =
      trackDragContext.dragState.sourceAnimation === animationId;
    const draggedTrackName = trackDragContext.dragState.draggedTrack;
    const isDraggedTrack = trackNames[trackIndex] === draggedTrackName;

    if (!isSameAnimation) {
      // Not reordering within same animation, let parent handler deal with it
      return;
    }

    // Calculate drop position based on mouse Y relative to element
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    const position = mouseY < rect.height / 2 ? "before" : "after";

    setDragOverElement(`track-${trackIndex}`);
    setDropTargetIndex(trackIndex);
    setDropPosition(position);
    setIsValidDrop(!isDraggedTrack); // Can't drop on itself

    e.dataTransfer.dropEffect = isDraggedTrack ? "none" : "move";
  };

  const handleTrackDragLeave = (trackIndex: number) => {
    if (dragOverElement === `track-${trackIndex}`) {
      setDragOverElement(null);
      setDropTargetIndex(null);
      setDropPosition(null);
    }
  };

  const handleTrackDrop = (
    trackIndex: number,
    e: DragEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (
      !trackDragContext ||
      !trackDragContext.dragState.draggedTrack ||
      !trackDragContext.dragState.sourceAnimation ||
      dropPosition === null
    )
      return;

    const isSameAnimation =
      trackDragContext.dragState.sourceAnimation === animationId;

    if (isSameAnimation && trackDragContext.onReorder) {
      // Reordering within same animation
      const draggedTrackName = trackDragContext.dragState.draggedTrack;
      const fromIndex = trackNames.indexOf(draggedTrackName);
      let toIndex = trackIndex;

      // Adjust toIndex based on drop position
      if (dropPosition === "after") {
        toIndex++;
      }

      // Adjust if dragging downward (removing from earlier position)
      if (fromIndex < toIndex) {
        toIndex--;
      }

      if (fromIndex !== -1 && fromIndex !== toIndex) {
        trackDragContext.onReorder(animationId, fromIndex, toIndex);
      }
    }

    setDragOverElement(null);
    setIsValidDrop(false);
    setDropTargetIndex(null);
    setDropPosition(null);
    trackDragContext.endDrag();
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

  return {
    handleTrackDragStart,
    handleTrackDrag,
    handleTrackDragEnd,
    handleDragOver,
    handleDragLeave,
    handleTrackDragOver,
    handleTrackDragLeave,
    handleTrackDrop,
    handleDrop,
    dragOverElement,
    isValidDrop,
    dropPosition,
  };
};
