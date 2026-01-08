import type { GeppettoImage } from "@geppetto/types";
import { render } from "@testing-library/react";
import { type FunctionComponent, type ReactElement } from "react";

import { FileContext, useFile } from "@/application/state/FileContext";

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
