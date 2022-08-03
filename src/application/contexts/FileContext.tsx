import { createContext, PropsWithChildren, useContext, useState } from "react";
import { newFile } from "../../animation/file2/new";
import { GeppettoImage } from "../../animation/file2/types";
import { UpdateState, UseState } from "../types";

export const ImageContext = createContext<{
  file: GeppettoImage;
  setFile: UpdateState<GeppettoImage>;
}>({ file: newFile(), setFile: () => {} });

export const FileContext: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [file, setFile] = useState<GeppettoImage>(newFile());
  return (
    <ImageContext.Provider value={{ file, setFile }}>
      {children}
    </ImageContext.Provider>
  );
};

export const useFile = (): UseState<GeppettoImage> => {
  const value = useContext(ImageContext);
  return [value.file, value.setFile];
};
