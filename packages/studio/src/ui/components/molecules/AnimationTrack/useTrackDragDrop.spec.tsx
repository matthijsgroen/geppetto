import { act, renderHook } from "@testing-library/react";
import type { DragEvent, FC, PropsWithChildren } from "react";

import { TrackDragProvider, useTrackDrag } from "./TrackDragContext";
import { useTrackDragDrop } from "./useTrackDragDrop";

// Helper to create mock DragEvent
const createMockDragEvent = (
  overrides: Partial<DragEvent<HTMLDivElement>> = {}
): DragEvent<HTMLDivElement> => {
  const mockDataTransfer = {
    effectAllowed: "none" as DataTransfer["effectAllowed"],
    dropEffect: "none" as DataTransfer["dropEffect"],
    setData: vi.fn(),
    getData: vi.fn(),
  } as unknown as DataTransfer;

  return {
    preventDefault: vi.fn(),
    stopPropagation: vi.fn(),
    dataTransfer: mockDataTransfer,
    clientX: 100,
    clientY: 100,
    currentTarget: {
      getBoundingClientRect: () => ({
        top: 0,
        left: 0,
        width: 200,
        height: 40,
        bottom: 40,
        right: 200,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }),
    } as HTMLDivElement,
    ...overrides,
  } as DragEvent<HTMLDivElement>;
};

describe("useTrackDragDrop", () => {
  const animationId = "test-animation";
  const trackNames = ["track1", "track2", "track3"];

  const createWrapper = ({
    onMove,
    onReorder,
  }: {
    onMove?: (
      from: { track: string; animation: string },
      to: { animation: string }
    ) => void;
    onReorder?: (
      animationId: string,
      fromIndex: number,
      toIndex: number
    ) => void;
  } = {}): FC<PropsWithChildren> => {
    const Wrapper: FC<PropsWithChildren> = ({ children }) => (
      <TrackDragProvider onMove={onMove} onReorder={onReorder}>
        {children}
      </TrackDragProvider>
    );
    return Wrapper;
  };

  describe("initialization", () => {
    it("initializes with default state", () => {
      const { result } = renderHook(
        () => useTrackDragDrop(animationId, trackNames),
        {
          wrapper: createWrapper(),
        }
      );

      expect(result.current.dragOverElement).toBeNull();
      expect(result.current.isValidDrop).toBe(false);
      expect(result.current.dropPosition).toBeNull();
    });
  });

  describe("handleTrackDragStart", () => {
    it("starts drag with track name and animation ID", () => {
      const { result } = renderHook(
        () => useTrackDragDrop(animationId, trackNames),
        {
          wrapper: createWrapper(),
        }
      );

      const mockEvent = createMockDragEvent();
      act(() => {
        result.current.handleTrackDragStart("track1", mockEvent);
      });

      expect(mockEvent.dataTransfer.effectAllowed).toBe("move");
      expect(mockEvent.dataTransfer.setData).toHaveBeenCalledWith(
        "text/plain",
        "track1"
      );
    });
  });

  describe("handleTrackDragEnd", () => {
    it("ends the drag operation", () => {
      const { result } = renderHook(
        () => useTrackDragDrop(animationId, trackNames),
        {
          wrapper: createWrapper(),
        }
      );

      const mockEvent = createMockDragEvent();
      act(() => {
        result.current.handleTrackDragStart("track1", mockEvent);
      });
      act(() => {
        result.current.handleTrackDragEnd();
      });

      expect(() => result.current.handleTrackDragEnd()).not.toThrow();
    });
  });

  describe("handleDragOver - animation level", () => {
    it("sets valid drop state when dragging from different animation without duplicates", () => {
      const wrapper = createWrapper();

      const { result } = renderHook(
        () => {
          const context = useTrackDrag();
          const hook = useTrackDragDrop(animationId, trackNames);
          return { context, hook };
        },
        { wrapper }
      );

      act(() => {
        result.current.context?.startDrag(
          "sourceTrack",
          "source-animation",
          100,
          100
        );
      });

      const dragOverEvent = createMockDragEvent();
      act(() => {
        result.current.hook.handleDragOver(dragOverEvent);
      });

      expect(dragOverEvent.preventDefault).toHaveBeenCalled();
      expect(result.current.hook.dragOverElement).toBe("animation-name");
      expect(result.current.hook.isValidDrop).toBe(true);
      expect(dragOverEvent.dataTransfer.dropEffect).toBe("move");
    });

    it("sets invalid drop state when track name already exists", () => {
      const wrapper = createWrapper();

      const { result } = renderHook(
        () => {
          const context = useTrackDrag();
          const hook = useTrackDragDrop(animationId, trackNames);
          return { context, hook };
        },
        { wrapper }
      );

      act(() => {
        result.current.context?.startDrag(
          "track1",
          "source-animation",
          100,
          100
        );
      });

      const dragOverEvent = createMockDragEvent();
      act(() => {
        result.current.hook.handleDragOver(dragOverEvent);
      });

      expect(result.current.hook.isValidDrop).toBe(false);
      expect(dragOverEvent.dataTransfer.dropEffect).toBe("none");
    });

    it("sets invalid drop state when dragging from same animation", () => {
      const { result } = renderHook(
        () => useTrackDragDrop(animationId, trackNames),
        {
          wrapper: createWrapper(),
        }
      );

      const startEvent = createMockDragEvent();
      act(() => {
        result.current.handleTrackDragStart("track1", startEvent);
      });

      const dragOverEvent = createMockDragEvent();
      act(() => {
        result.current.handleDragOver(dragOverEvent);
      });

      expect(result.current.isValidDrop).toBe(false);
      expect(dragOverEvent.dataTransfer.dropEffect).toBe("none");
    });
  });

  describe("handleDragLeave - animation level", () => {
    it("clears drag over state", () => {
      const wrapper = createWrapper();

      const { result } = renderHook(
        () => {
          const context = useTrackDrag();
          const hook = useTrackDragDrop(animationId, trackNames);
          return { context, hook };
        },
        { wrapper }
      );

      act(() => {
        result.current.context?.startDrag(
          "sourceTrack",
          "source-animation",
          100,
          100
        );
      });

      const dragOverEvent = createMockDragEvent();
      act(() => {
        result.current.hook.handleDragOver(dragOverEvent);
      });
      expect(result.current.hook.dragOverElement).toBe("animation-name");

      act(() => {
        result.current.hook.handleDragLeave();
      });
      expect(result.current.hook.dragOverElement).toBeNull();
      expect(result.current.hook.isValidDrop).toBe(false);
      expect(result.current.hook.dropPosition).toBeNull();
    });
  });

  describe("handleTrackDragOver - track level", () => {
    it("calculates 'before' position when mouse is in top half", () => {
      const { result } = renderHook(
        () => useTrackDragDrop(animationId, trackNames),
        {
          wrapper: createWrapper(),
        }
      );

      const startEvent = createMockDragEvent();
      act(() => {
        result.current.handleTrackDragStart("track1", startEvent);
      });

      const dragOverEvent = createMockDragEvent({
        clientY: 15,
        currentTarget: {
          getBoundingClientRect: () => ({
            top: 10,
            height: 40,
            left: 0,
            width: 200,
            bottom: 50,
            right: 200,
            x: 0,
            y: 10,
            toJSON: () => ({}),
          }),
        } as HTMLDivElement,
      });

      act(() => {
        result.current.handleTrackDragOver(1, dragOverEvent);
      });

      expect(result.current.dropPosition).toBe("before");
      expect(result.current.dragOverElement).toBe("track-1");
    });

    it("calculates 'after' position when mouse is in bottom half", () => {
      const { result } = renderHook(
        () => useTrackDragDrop(animationId, trackNames),
        {
          wrapper: createWrapper(),
        }
      );

      const startEvent = createMockDragEvent();
      act(() => {
        result.current.handleTrackDragStart("track1", startEvent);
      });

      const dragOverEvent = createMockDragEvent({
        clientY: 35,
        currentTarget: {
          getBoundingClientRect: () => ({
            top: 10,
            height: 40,
            left: 0,
            width: 200,
            bottom: 50,
            right: 200,
            x: 0,
            y: 10,
            toJSON: () => ({}),
          }),
        } as HTMLDivElement,
      });

      act(() => {
        result.current.handleTrackDragOver(1, dragOverEvent);
      });

      expect(result.current.dropPosition).toBe("after");
      expect(result.current.dragOverElement).toBe("track-1");
    });

    it("sets invalid drop when dragging over itself", () => {
      const { result } = renderHook(
        () => useTrackDragDrop(animationId, trackNames),
        {
          wrapper: createWrapper(),
        }
      );

      const startEvent = createMockDragEvent();
      act(() => {
        result.current.handleTrackDragStart("track2", startEvent);
      });

      const dragOverEvent = createMockDragEvent();
      act(() => {
        result.current.handleTrackDragOver(1, dragOverEvent);
      });

      expect(result.current.isValidDrop).toBe(false);
      expect(dragOverEvent.dataTransfer.dropEffect).toBe("none");
    });
  });

  describe("handleTrackDragLeave - track level", () => {
    it("clears state only when leaving the active drag-over element", () => {
      const { result } = renderHook(
        () => useTrackDragDrop(animationId, trackNames),
        {
          wrapper: createWrapper(),
        }
      );

      const startEvent = createMockDragEvent();
      act(() => {
        result.current.handleTrackDragStart("track1", startEvent);
      });

      const dragOverEvent = createMockDragEvent();
      act(() => {
        result.current.handleTrackDragOver(1, dragOverEvent);
      });
      expect(result.current.dragOverElement).toBe("track-1");

      act(() => {
        result.current.handleTrackDragLeave(1);
      });
      expect(result.current.dragOverElement).toBeNull();
      expect(result.current.dropPosition).toBeNull();
    });

    it("does not clear state when leaving a different element", () => {
      const { result } = renderHook(
        () => useTrackDragDrop(animationId, trackNames),
        {
          wrapper: createWrapper(),
        }
      );

      const startEvent = createMockDragEvent();
      act(() => {
        result.current.handleTrackDragStart("track1", startEvent);
      });

      const dragOverEvent = createMockDragEvent();
      act(() => {
        result.current.handleTrackDragOver(1, dragOverEvent);
      });
      expect(result.current.dragOverElement).toBe("track-1");

      act(() => {
        result.current.handleTrackDragLeave(2);
      });
      expect(result.current.dragOverElement).toBe("track-1");
    });
  });

  describe("handleTrackDrop - reordering within same animation", () => {
    it("calls onReorder with correct indices when dropping before", () => {
      const onReorder = vi.fn();
      const { result } = renderHook(
        () => useTrackDragDrop(animationId, trackNames),
        {
          wrapper: createWrapper({ onReorder }),
        }
      );

      const startEvent = createMockDragEvent();
      act(() => {
        result.current.handleTrackDragStart("track3", startEvent);
      });

      const dragOverEvent = createMockDragEvent({
        clientY: 15,
        currentTarget: {
          getBoundingClientRect: () => ({
            top: 10,
            height: 40,
            left: 0,
            width: 200,
            bottom: 50,
            right: 200,
            x: 0,
            y: 10,
            toJSON: () => ({}),
          }),
        } as HTMLDivElement,
      });
      act(() => {
        result.current.handleTrackDragOver(1, dragOverEvent);
      });

      const dropEvent = createMockDragEvent();
      act(() => {
        result.current.handleTrackDrop(1, dropEvent);
      });

      expect(onReorder).toHaveBeenCalledWith(animationId, 2, 1);
      expect(dropEvent.preventDefault).toHaveBeenCalled();
      expect(dropEvent.stopPropagation).toHaveBeenCalled();
      expect(result.current.dragOverElement).toBeNull();
    });

    it("calls onReorder with correct indices when dropping after", () => {
      const onReorder = vi.fn();
      const { result } = renderHook(
        () => useTrackDragDrop(animationId, trackNames),
        {
          wrapper: createWrapper({ onReorder }),
        }
      );

      const startEvent = createMockDragEvent();
      act(() => {
        result.current.handleTrackDragStart("track1", startEvent);
      });

      const dragOverEvent = createMockDragEvent({
        clientY: 35,
        currentTarget: {
          getBoundingClientRect: () => ({
            top: 10,
            height: 40,
            left: 0,
            width: 200,
            bottom: 50,
            right: 200,
            x: 0,
            y: 10,
            toJSON: () => ({}),
          }),
        } as HTMLDivElement,
      });
      act(() => {
        result.current.handleTrackDragOver(1, dragOverEvent);
      });

      const dropEvent = createMockDragEvent();
      act(() => {
        result.current.handleTrackDrop(1, dropEvent);
      });

      expect(onReorder).toHaveBeenCalledWith(animationId, 0, 1);
      expect(result.current.dragOverElement).toBeNull();
    });

    it("adjusts toIndex when dragging downward", () => {
      const onReorder = vi.fn();
      const { result } = renderHook(
        () => useTrackDragDrop(animationId, trackNames),
        {
          wrapper: createWrapper({ onReorder }),
        }
      );

      const startEvent = createMockDragEvent();
      act(() => {
        result.current.handleTrackDragStart("track1", startEvent);
      });

      const dragOverEvent = createMockDragEvent({
        clientY: 35,
        currentTarget: {
          getBoundingClientRect: () => ({
            top: 10,
            height: 40,
            left: 0,
            width: 200,
            bottom: 50,
            right: 200,
            x: 0,
            y: 10,
            toJSON: () => ({}),
          }),
        } as HTMLDivElement,
      });
      act(() => {
        result.current.handleTrackDragOver(2, dragOverEvent);
      });

      const dropEvent = createMockDragEvent();
      act(() => {
        result.current.handleTrackDrop(2, dropEvent);
      });

      expect(onReorder).toHaveBeenCalledWith(animationId, 0, 2);
    });

    it("does not call onReorder when dropping at same position", () => {
      const onReorder = vi.fn();
      const { result } = renderHook(
        () => useTrackDragDrop(animationId, trackNames),
        {
          wrapper: createWrapper({ onReorder }),
        }
      );

      const startEvent = createMockDragEvent();
      act(() => {
        result.current.handleTrackDragStart("track2", startEvent);
      });

      const dragOverEvent = createMockDragEvent({
        clientY: 15,
        currentTarget: {
          getBoundingClientRect: () => ({
            top: 10,
            height: 40,
            left: 0,
            width: 200,
            bottom: 50,
            right: 200,
            x: 0,
            y: 10,
            toJSON: () => ({}),
          }),
        } as HTMLDivElement,
      });
      act(() => {
        result.current.handleTrackDragOver(1, dragOverEvent);
      });

      const dropEvent = createMockDragEvent();
      act(() => {
        result.current.handleTrackDrop(1, dropEvent);
      });

      expect(onReorder).not.toHaveBeenCalled();
    });
  });

  describe("handleDrop - moving between animations", () => {
    it("calls onMove when dropping valid track from different animation", () => {
      const onMove = vi.fn();
      const wrapper = createWrapper({ onMove });

      const { result } = renderHook(
        () => {
          const context = useTrackDrag();
          const hook = useTrackDragDrop(animationId, trackNames);
          return { context, hook };
        },
        { wrapper }
      );

      act(() => {
        result.current.context?.startDrag(
          "sourceTrack",
          "source-animation",
          100,
          100
        );
      });

      const dropEvent = createMockDragEvent();
      act(() => {
        result.current.hook.handleDrop(dropEvent);
      });

      expect(onMove).toHaveBeenCalledWith(
        { track: "sourceTrack", animation: "source-animation" },
        { animation: animationId }
      );
      expect(dropEvent.preventDefault).toHaveBeenCalled();
    });

    it("does not call onMove when track name already exists", () => {
      const onMove = vi.fn();
      const wrapper = createWrapper({ onMove });

      const { result } = renderHook(
        () => {
          const context = useTrackDrag();
          const hook = useTrackDragDrop(animationId, trackNames);
          return { context, hook };
        },
        { wrapper }
      );

      act(() => {
        result.current.context?.startDrag(
          "track1",
          "source-animation",
          100,
          100
        );
      });

      const dropEvent = createMockDragEvent();
      act(() => {
        result.current.hook.handleDrop(dropEvent);
      });

      expect(onMove).not.toHaveBeenCalled();
    });

    it("does not call onMove when dropping from same animation", () => {
      const onMove = vi.fn();
      const { result } = renderHook(
        () => useTrackDragDrop(animationId, trackNames),
        {
          wrapper: createWrapper({ onMove }),
        }
      );

      const startEvent = createMockDragEvent();
      act(() => {
        result.current.handleTrackDragStart("track1", startEvent);
      });

      const dropEvent = createMockDragEvent();
      act(() => {
        result.current.handleDrop(dropEvent);
      });

      expect(onMove).not.toHaveBeenCalled();
    });

    it("clears drag state after drop", () => {
      const onMove = vi.fn();
      const wrapper = createWrapper({ onMove });

      const { result } = renderHook(
        () => {
          const context = useTrackDrag();
          const hook = useTrackDragDrop(animationId, trackNames);
          return { context, hook };
        },
        { wrapper }
      );

      act(() => {
        result.current.context?.startDrag(
          "sourceTrack",
          "source-animation",
          100,
          100
        );
      });

      const dragOverEvent = createMockDragEvent();
      act(() => {
        result.current.hook.handleDragOver(dragOverEvent);
      });
      expect(result.current.hook.isValidDrop).toBe(true);

      const dropEvent = createMockDragEvent();
      act(() => {
        result.current.hook.handleDrop(dropEvent);
      });

      expect(result.current.hook.dragOverElement).toBeNull();
      expect(result.current.hook.isValidDrop).toBe(false);
    });
  });

  describe("edge cases", () => {
    it("handles operations without context gracefully", () => {
      const { result } = renderHook(() =>
        useTrackDragDrop(animationId, trackNames)
      );

      const mockEvent = createMockDragEvent();

      expect(() =>
        result.current.handleTrackDragStart("track1", mockEvent)
      ).not.toThrow();
      expect(() => result.current.handleTrackDrag(mockEvent)).not.toThrow();
      expect(() => result.current.handleTrackDragEnd()).not.toThrow();
    });

    it("handles drop without active drag", () => {
      const onMove = vi.fn();
      const { result } = renderHook(
        () => useTrackDragDrop(animationId, trackNames),
        {
          wrapper: createWrapper({ onMove }),
        }
      );

      const dropEvent = createMockDragEvent();
      act(() => {
        result.current.handleDrop(dropEvent);
      });

      expect(onMove).not.toHaveBeenCalled();
      expect(dropEvent.preventDefault).toHaveBeenCalled();
    });

    it("handles track drop without drop position", () => {
      const onReorder = vi.fn();
      const { result } = renderHook(
        () => useTrackDragDrop(animationId, trackNames),
        {
          wrapper: createWrapper({ onReorder }),
        }
      );

      const startEvent = createMockDragEvent();
      act(() => {
        result.current.handleTrackDragStart("track1", startEvent);
      });

      const dropEvent = createMockDragEvent();
      act(() => {
        result.current.handleTrackDrop(1, dropEvent);
      });

      expect(onReorder).not.toHaveBeenCalled();
    });
  });
});
