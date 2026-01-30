import type { GeppettoImage } from "@geppetto/types";
import type { Dispatch, PropsWithChildren, SetStateAction } from "react";
import { createContext, useContext } from "react";

import {
  type UndoRedoHookResult,
  useUndoRedo,
} from "@/application/state/hooks/useUndoRedo";
import { newFile } from "@/domain/animation/file2/new";

export const FileHistoryContext = createContext<
  UndoRedoHookResult<GeppettoImage>
>({
  state: newFile(),
  set: () => {},
  canUndo: false,
  canRedo: false,
  undo: () => {},
  redo: () => {},
  setGrouped: () => {},
  endGrouping: () => {},
});

export const FileContext: React.FC<
  PropsWithChildren<{ startFile?: GeppettoImage }>
> = ({ children, startFile = newFile() }) => {
  const undoState = useUndoRedo<GeppettoImage>(startFile);
  return (
    <FileHistoryContext.Provider value={undoState}>
      {children}
    </FileHistoryContext.Provider>
  );
};

export const useFile = (): [
  GeppettoImage,
  Dispatch<SetStateAction<GeppettoImage>>,
] => {
  const value = useContext(FileHistoryContext);
  return [value.state, value.set];
};

export const useFileUndoRedo = (): UndoRedoHookResult<GeppettoImage> => {
  return useContext(FileHistoryContext);
};
