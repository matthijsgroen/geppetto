import {
  createContext,
  type PropsWithChildren,
  useContext,
  useState,
} from "react";

import { newFile } from "@/domain/animation/file2/new";
import { type GeppettoImage } from "@/dtos/animation-file2.dto";
import { type UpdateState, type UseState } from "@/dtos/application.dto";

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
