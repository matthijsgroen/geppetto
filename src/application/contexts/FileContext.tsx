import { createContext, PropsWithChildren, useContext, useState } from "react";
import { newFile } from "../../animation/file2/new";
import { GeppettoImage } from "../../animation/file2/types";
import { UpdateState, UseState } from "../types";

export const ImageFileContext = createContext<{
  file: GeppettoImage;
  setFile: UpdateState<GeppettoImage>;
}>({ file: newFile(), setFile: () => {} });

export const FileContext: React.FC<
  PropsWithChildren<{ startFile?: GeppettoImage }>
> = ({ children, startFile = newFile() }) => {
  const [file, setFile] = useState<GeppettoImage>(startFile);
  return (
    <ImageFileContext.Provider value={{ file, setFile }}>
      {children}
    </ImageFileContext.Provider>
  );
};

export const useFile = (): UseState<GeppettoImage> => {
  const value = useContext(ImageFileContext);
  return [value.file, value.setFile];
};
