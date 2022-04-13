import React, { useEffect, useState } from "react";
import { GeppettoImage } from "../animation/file2/types";
import { ThemeProvider } from "styled-components";
import { Layers } from "./layers/Layers";
import { defaultTheme } from "./theme/default";
// import { v2Format } from "../animation/file2/mockdata/file2.0";
import { newFile } from "../animation/file2/new";
import { ApplicationMenu } from "./applicationMenu/ApplicationMenu";

const updateWindowTitle = (
  animFile: string | null,
  textureFile: string | null
) => {
  document.title = `${animFile ? animFile : "Untitled"} — ${
    textureFile ? textureFile : "No texture"
  }`;
};

// const OUTPUT_VERSION_NUMBER = "2.0";

const App: React.FC = () => {
  const fileState = useState<GeppettoImage>(newFile());
  const textureFileState = useState<HTMLImageElement | null>(null);

  const fileName = useState<string | null>(null);
  const textureFileName = useState<string | null>(null);

  const zoomState = useState(1.0);
  const panXState = useState(0.0);
  const panYState = useState(0.0);

  useEffect(() => {
    updateWindowTitle(fileName[0], textureFileName[0]);
  }, [fileName[0], textureFileName[0]]);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Layers
        menu={
          <ApplicationMenu
            fileNameState={fileName}
            fileState={fileState}
            textureFileNameState={textureFileName}
            textureFileState={textureFileState}
          />
        }
        zoomState={zoomState}
        panXState={panXState}
        panYState={panYState}
        fileState={fileState}
        textureState={textureFileState}
      />
    </ThemeProvider>
  );
};

export default App;
