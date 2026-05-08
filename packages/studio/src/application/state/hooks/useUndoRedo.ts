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
  setWithoutHistory: (newState: T | ((prevState: T) => T)) => void;
};

export const useUndoRedo = <T>(
  initialState: T,
  historyLength = 100
): UndoRedoHookResult<T> => {
  const [state, setState] = useState<{
    history: T[];
    pointer: number;
    transaction: [name: string, pointer: number] | null;
  }>(() => ({
    history: [initialState],
    pointer: 0,
    transaction: null,
  }));

  const cropHistory = useCallback(
    (
      history: T[],
      pointer: number,
      transaction: [name: string, pointer: number] | null
    ) => {
      if (history.length <= historyLength) {
        return { history, pointer, transaction };
      }

      const start = history.length - historyLength;
      const croppedHistory = history.slice(-historyLength);
      const croppedPointer = Math.max(0, pointer - start);
      const croppedTransaction =
        transaction && transaction[1] >= start
          ? ([transaction[0], transaction[1] - start] as [
              name: string,
              pointer: number,
            ])
          : null;

      return {
        history: croppedHistory,
        pointer: croppedPointer,
        transaction: croppedTransaction,
      };
    },
    [historyLength]
  );

  const set = useCallback(
    (newState: T | ((prevState: T) => T)) => {
      setState((prev) => {
        const resolvedState =
          typeof newState === "function"
            ? (newState as (prevState: T) => T)(prev.history[prev.pointer])
            : newState;

        const newHistory = prev.history.slice(0, prev.pointer + 1);
        newHistory.push(resolvedState);

        const next = cropHistory(newHistory, newHistory.length - 1, null);

        return {
          history: next.history,
          pointer: next.pointer,
          transaction: null,
        };
      });
    },
    [cropHistory]
  );

  const setGrouped = useCallback(
    (groupName: string, newState: T | ((prevState: T) => T)) => {
      setState((prev) => {
        const resolvedState =
          typeof newState === "function"
            ? (newState as (prevState: T) => T)(prev.history[prev.pointer])
            : newState;

        if (prev.transaction && prev.transaction[0] === groupName) {
          const transactionPointer = prev.transaction[1];
          const newHistory = prev.history.slice(0, transactionPointer + 1);
          newHistory[transactionPointer] = resolvedState;

          const next = cropHistory(newHistory, transactionPointer, [
            groupName,
            transactionPointer,
          ]);

          return {
            history: next.history,
            pointer: next.pointer,
            transaction: next.transaction,
          };
        }

        const newHistory = prev.history.slice(0, prev.pointer + 1);
        newHistory.push(resolvedState);

        const nextPointer = newHistory.length - 1;
        const next = cropHistory(newHistory, nextPointer, [
          groupName,
          nextPointer,
        ]);

        return {
          history: next.history,
          pointer: next.pointer,
          transaction: next.transaction,
        };
      });
    },
    [cropHistory]
  );

  const undo = useCallback(() => {
    setState((prev) => {
      if (prev.pointer === 0) {
        return prev;
      }

      return {
        history: prev.history,
        pointer: prev.pointer - 1,
        transaction: null,
      };
    });
  }, []);

  const redo = useCallback(() => {
    setState((prev) => {
      if (prev.pointer >= prev.history.length - 1) {
        return prev;
      }

      return {
        history: prev.history,
        pointer: prev.pointer + 1,
        transaction: null,
      };
    });
  }, []);

  const setWithoutHistory = useCallback(
    (newState: T | ((prevState: T) => T)) => {
      setState((prev) => {
        const resolvedState =
          typeof newState === "function"
            ? (newState as (prevState: T) => T)(prev.history[prev.pointer])
            : newState;

        const newHistory = [...prev.history];
        newHistory[prev.pointer] = resolvedState;

        return {
          history: newHistory,
          pointer: prev.pointer,
          transaction: prev.transaction,
        };
      });
    },
    []
  );

  const endGrouping = useCallback(() => {
    setState((prev) => {
      if (!prev.transaction) {
        return prev;
      }

      return {
        history: prev.history,
        pointer: prev.pointer,
        transaction: null,
      };
    });
  }, []);

  return useMemo(() => {
    const canUndo = state.pointer > 0;
    const canRedo = state.pointer < state.history.length - 1;

    return {
      state: state.history[state.pointer],
      canUndo,
      canRedo,
      undo,
      redo,
      setGrouped,
      set,
      setWithoutHistory,
      endGrouping,
    };
  }, [state, set, setWithoutHistory, undo, redo, setGrouped, endGrouping]);
};
