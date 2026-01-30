import type { FC, PropsWithChildren } from "react";
import { createContext, useContext, useState } from "react";

export type TrackDragState = {
  draggedTrack: string | null;
  sourceAnimation: string | null;
  mouseX: number;
  mouseY: number;
};

type TrackDragContextValue = {
  dragState: TrackDragState;
  startDrag: (
    trackName: string,
    animationId: string,
    x: number,
    y: number
  ) => void;
  updateDragPosition: (x: number, y: number) => void;
  endDrag: () => void;
  onMove?: (
    from: { track: string; animation: string },
    to: { animation: string }
  ) => void;
  onReorder?: (animationId: string, fromIndex: number, toIndex: number) => void;
};

const TrackDragContext = createContext<TrackDragContextValue | null>(null);

export const useTrackDrag = () => {
  const context = useContext(TrackDragContext);
  return context;
};

type TrackDragProviderProps = PropsWithChildren<{
  onMove?: (
    from: { track: string; animation: string },
    to: { animation: string }
  ) => void;
  onReorder?: (animationId: string, fromIndex: number, toIndex: number) => void;
}>;

export const TrackDragProvider: FC<TrackDragProviderProps> = ({
  children,
  onMove,
  onReorder,
}) => {
  const [dragState, setDragState] = useState<TrackDragState>({
    draggedTrack: null,
    sourceAnimation: null,
    mouseX: 0,
    mouseY: 0,
  });

  const startDrag = (
    trackName: string,
    animationId: string,
    x: number,
    y: number
  ) => {
    setDragState({
      draggedTrack: trackName,
      sourceAnimation: animationId,
      mouseX: x,
      mouseY: y,
    });
  };

  const updateDragPosition = (x: number, y: number) => {
    setDragState((prev) => ({
      ...prev,
      mouseX: x,
      mouseY: y,
    }));
  };

  const endDrag = () => {
    setDragState({
      draggedTrack: null,
      sourceAnimation: null,
      mouseX: 0,
      mouseY: 0,
    });
  };

  return (
    <TrackDragContext.Provider
      value={{
        dragState,
        startDrag,
        updateDragPosition,
        endDrag,
        onMove,
        onReorder,
      }}
    >
      {children}
    </TrackDragContext.Provider>
  );
};
