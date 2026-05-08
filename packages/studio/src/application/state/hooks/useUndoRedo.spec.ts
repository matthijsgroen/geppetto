import { act, renderHook } from "@testing-library/react";

import { useUndoRedo } from "./useUndoRedo";

describe("useUndoRedo", () => {
  it("should initialize with the initial state", () => {
    const { result } = renderHook(() => useUndoRedo(0));
    expect(result.current.state).toBe(0);
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
  });

  it("should set new state and manage undo/redo", () => {
    const { result } = renderHook(() => useUndoRedo(0));

    act(() => result.current.set(1));
    expect(result.current.state).toBe(1);
    expect(result.current.canUndo).toBe(true);
    expect(result.current.canRedo).toBe(false);

    act(() => result.current.undo());
    expect(result.current.state).toBe(0);
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(true);

    act(() => result.current.redo());
    expect(result.current.state).toBe(1);
    expect(result.current.canUndo).toBe(true);
    expect(result.current.canRedo).toBe(false);
  });

  describe("limited history length", () => {
    it("should limit history to specified length", () => {
      const { result } = renderHook(() => useUndoRedo(0, 2));

      act(() => result.current.set((s) => s + 1));
      act(() => result.current.set((s) => s + 1));
      act(() => result.current.set((s) => s + 1));

      expect(result.current.state).toBe(3);
      expect(result.current.canUndo).toBe(true);

      act(() => result.current.undo());
      expect(result.current.state).toBe(2);
      expect(result.current.canUndo).toBe(false);

      act(() => result.current.undo());
      expect(result.current.state).toBe(2);
    });
  });

  describe("grouping changes together", () => {
    it("should group changes within a group", () => {
      const { result } = renderHook(() => useUndoRedo(0));

      act(() => result.current.setGrouped("increment", (s) => s + 1));
      act(() => result.current.setGrouped("increment", (s) => s + 1));

      expect(result.current.state).toBe(2);
      expect(result.current.canUndo).toBe(true);

      act(() => {
        result.current.undo();
      });
      expect(result.current.state).toBe(0);
    });

    it("starts new group if group name does not match", () => {
      const { result } = renderHook(() => useUndoRedo(0));

      act(() => result.current.setGrouped("increment", (s) => s + 1));
      act(() => result.current.setGrouped("increment", (s) => s + 1));
      act(() => result.current.setGrouped("differentName", (s) => s + 1));

      expect(result.current.state).toBe(3);
      expect(result.current.canUndo).toBe(true);

      act(() => result.current.undo());
      expect(result.current.state).toBe(2);
      act(() => result.current.undo());
      expect(result.current.state).toBe(0);
    });

    it("starts ends transaction normal set is done", () => {
      const { result } = renderHook(() => useUndoRedo(0));

      act(() => result.current.setGrouped("increment", (s) => s + 1));
      act(() => result.current.setGrouped("increment", (s) => s + 1));
      act(() => result.current.set((s) => s + 1));
      act(() => result.current.setGrouped("increment", (s) => s + 1));

      expect(result.current.state).toBe(4);
      expect(result.current.canUndo).toBe(true);

      act(() => result.current.undo());
      expect(result.current.state).toBe(3);
      act(() => result.current.undo());
      expect(result.current.state).toBe(2);
      act(() => result.current.undo());
      expect(result.current.state).toBe(0);
    });

    it("keeps grouped updates deterministic with history cropping", () => {
      const { result } = renderHook(() => useUndoRedo(0, 2));

      act(() => {
        result.current.setGrouped("drag", (s) => s + 1);
        result.current.setGrouped("drag", (s) => s + 1);
        result.current.setGrouped("drag", (s) => s + 1);
      });

      expect(result.current.state).toBe(3);
      expect(result.current.canUndo).toBe(true);
      expect(result.current.canRedo).toBe(false);

      act(() => result.current.setGrouped("snap", (s) => s + 1));

      expect(result.current.state).toBe(4);
      expect(result.current.canUndo).toBe(true);
      expect(result.current.canRedo).toBe(false);

      act(() => result.current.undo());
      expect(result.current.state).toBe(3);
      expect(result.current.canUndo).toBe(false);
      expect(result.current.canRedo).toBe(true);
    });

    it("endGrouping causes next same-name setGrouped to start a new entry", () => {
      const { result } = renderHook(() => useUndoRedo(0));

      act(() => result.current.setGrouped("increment", (s) => s + 1));
      act(() => result.current.setGrouped("increment", (s) => s + 1));
      act(() => result.current.endGrouping());
      act(() => result.current.setGrouped("increment", (s) => s + 1));

      expect(result.current.state).toBe(3);

      act(() => result.current.undo());
      expect(result.current.state).toBe(2);
      act(() => result.current.undo());
      expect(result.current.state).toBe(0);
    });

    it("endGrouping is a no-op when no transaction is active", () => {
      const { result } = renderHook(() => useUndoRedo(0));

      act(() => result.current.set(1));
      act(() => result.current.endGrouping());

      expect(result.current.state).toBe(1);
      expect(result.current.canUndo).toBe(true);
      expect(result.current.canRedo).toBe(false);
    });
  });

  it("clears the redo branch when a new set is called after undo", () => {
    const { result } = renderHook(() => useUndoRedo(0));

    act(() => result.current.set(1));
    act(() => result.current.undo());
    act(() => result.current.set(2));

    expect(result.current.state).toBe(2);
    expect(result.current.canUndo).toBe(true);
    expect(result.current.canRedo).toBe(false);
  });

  describe("setWithoutHistory", () => {
    it("updates state in-place without adding a history entry", () => {
      const { result } = renderHook(() => useUndoRedo(0));

      act(() => result.current.setWithoutHistory(99));

      expect(result.current.state).toBe(99);
      expect(result.current.canUndo).toBe(false);
      expect(result.current.canRedo).toBe(false);
    });

    it("replaces the current slot so undo skips it", () => {
      const { result } = renderHook(() => useUndoRedo(0));

      act(() => result.current.set(1));
      act(() => result.current.setWithoutHistory(99));

      expect(result.current.state).toBe(99);
      expect(result.current.canUndo).toBe(true);

      act(() => result.current.undo());
      expect(result.current.state).toBe(0);
    });

    it("accepts a functional updater", () => {
      const { result } = renderHook(() => useUndoRedo(0));

      act(() => result.current.set(10));
      act(() => result.current.setWithoutHistory((s) => s + 5));

      expect(result.current.state).toBe(15);
      expect(result.current.canUndo).toBe(true);

      act(() => result.current.undo());
      expect(result.current.state).toBe(0);
    });

    it("preserves the active transaction so subsequent same-name setGrouped still coalesces", () => {
      const { result } = renderHook(() => useUndoRedo(0));

      act(() => result.current.setGrouped("drag", (s) => s + 1));
      act(() => result.current.setWithoutHistory((s) => s + 100));
      act(() => result.current.setGrouped("drag", (s) => s + 1));

      expect(result.current.state).toBe(102);

      act(() => result.current.undo());
      expect(result.current.state).toBe(0);
    });
  });
});
