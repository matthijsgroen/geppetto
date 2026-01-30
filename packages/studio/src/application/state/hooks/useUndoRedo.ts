import { useCallback, useMemo, useState } from "react";

export type UndoRedoHookResult<T> = {
  state: T;
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  endGrouping: () => void;
  setGrouped: (groupName: string, newState: T | ((prevState: T) => T)) => void;
  set: (newState: T | ((prevState: T) => T)) => void;
};

export const useUndoRedo = <T>(
  initialState: T,
  historyLength = 100
): UndoRedoHookResult<T> => {
  const [history, setHistory] = useState<T[]>([initialState]);
  const [pointer, setPointer] = useState(0);
  const [transaction, setTransaction] = useState<
    [name: string, pointer: number] | null
  >(null);

  const set = useCallback(
    (newState: T | ((prevState: T) => T)) => {
      const resolvedState =
        typeof newState === "function"
          ? (newState as (prevState: T) => T)(history[pointer])
          : newState;

      if (transaction) {
        setTransaction(null);
      }
      const newHistory = history.slice(0, pointer + 1);
      newHistory.push(resolvedState);
      const croppedHistory = newHistory.slice(-historyLength);
      setHistory(croppedHistory);
      setPointer(croppedHistory.length - 1);
    },
    [history, pointer, transaction, historyLength]
  );

  const setGrouped = useCallback(
    (groupName: string, newState: T | ((prevState: T) => T)) => {
      const resolvedState =
        typeof newState === "function"
          ? (newState as (prevState: T) => T)(history[pointer])
          : newState;

      if (transaction && transaction[0] === groupName) {
        // Replace the state at the transaction pointer
        const newHistory = [...history];
        newHistory[transaction[1]] = resolvedState;
        setHistory(newHistory);
        setPointer(transaction[1]);
      } else {
        // Start a new transaction
        const newHistory = history.slice(0, pointer + 1);
        newHistory.push(resolvedState);
        const croppedHistory = newHistory.slice(-historyLength);
        setHistory(croppedHistory);
        setPointer(croppedHistory.length - 1);
        setTransaction([groupName, croppedHistory.length - 1]);
      }
    },
    [history, pointer, transaction, historyLength]
  );

  const undo = useCallback(() => {
    if (pointer > 0) {
      setPointer(pointer - 1);
      setTransaction(null);
    }
  }, [pointer]);

  const redo = useCallback(() => {
    if (pointer < history.length - 1) {
      setPointer(pointer + 1);
      setTransaction(null);
    }
  }, [pointer, history.length]);

  const endGrouping = useCallback(() => {
    setTransaction(null);
  }, []);

  return useMemo(() => {
    const canUndo = pointer > 0;
    const canRedo = pointer < history.length - 1;

    return {
      state: history[pointer],
      canUndo,
      canRedo,
      undo,
      redo,
      setGrouped,
      set,
      endGrouping,
    };
  }, [history, pointer, set, undo, redo, setGrouped, endGrouping]);
};
