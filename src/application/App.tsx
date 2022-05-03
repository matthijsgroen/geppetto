import React, { useEffect, useState } from "react";
import { ThemeProvider } from "styled-components";
import { Layers } from "./layers/Layers";
import { defaultTheme } from "./theme/default";
import { ApplicationMenu } from "./applicationMenu/ApplicationMenu";
import { AppSection } from "./types";
import { Composition } from "./composition/Composition";
import { AppContext } from "./applicationMenu/ApplicationContext";
import { FileContext } from "./applicationMenu/FileContext";

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
  const textureFileState = useState<HTMLImageElement | null>(null);
  const [appSection, setAppSection] = useState<AppSection>("layers");

  const [fileName, setFileName] = useState<string | null>(null);
  const [textureFileName, setTextureFileName] = useState<string | null>(null);

  const zoomState = useState(1.0);
  const panXState = useState(0.0);
  const panYState = useState(0.0);

  useEffect(() => {
    updateWindowTitle(fileName, textureFileName);
  }, [fileName, textureFileName]);

  const applicationMenu = (
    <ApplicationMenu
      fileNameState={[fileName, setFileName]}
      textureFileNameState={[textureFileName, setTextureFileName]}
      textureFileState={textureFileState}
    />
  );

  return (
    <ThemeProvider theme={defaultTheme}>
      <FileContext>
        <AppContext>
          {appSection === "layers" && (
            <Layers
              menu={applicationMenu}
              zoomState={zoomState}
              panXState={panXState}
              panYState={panYState}
              textureState={textureFileState}
              onSectionChange={setAppSection}
            />
          )}
          {appSection === "composition" && (
            <Composition
              menu={applicationMenu}
              zoomState={zoomState}
              panXState={panXState}
              panYState={panYState}
              textureState={textureFileState}
              onSectionChange={setAppSection}
            />
          )}
        </AppContext>
      </FileContext>
    </ThemeProvider>
  );
};

export default App;
