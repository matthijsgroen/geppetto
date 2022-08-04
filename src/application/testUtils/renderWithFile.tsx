import { render } from "@testing-library/react";
import { FunctionComponent, ReactElement } from "react";
import { GeppettoImage } from "../../animation/file2/types";
import { FileContext, useFile } from "../contexts/FileContext";

const FileObserver: FunctionComponent<{
  onFileChange: (file: GeppettoImage) => void;
}> = ({ onFileChange }) => {
  const [file] = useFile();
  onFileChange(file);
  return null;
};

export const renderWithFile = (
  file: GeppettoImage,
  component: ReactElement
) => {
  let currentFile = file;

  const view = render(
    <FileContext startFile={file}>
      <FileObserver
        onFileChange={(f) => {
          currentFile = f;
        }}
      />
      {component}
    </FileContext>
  );

  return { getFile: () => currentFile, ...view };
};
