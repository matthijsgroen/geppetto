import React, { useEffect, useState } from "react";
import { ThemeProvider } from "styled-components";
import { Layers } from "./layers/Layers";
import { defaultTheme } from "./theme/default";
import { ApplicationMenu } from "./applicationMenu/ApplicationMenu";
import { AppSection } from "./types";
import { Composition } from "./composition/Composition";
import { AppContext } from "./contexts/ApplicationContext";
import { FileContext } from "./contexts/FileContext";
import { ScreenTranslationContext } from "./contexts/ScreenTranslationContext";
import { ImageControlContext } from "./contexts/ImageControlContext";

const updateWindowTitle = (
  animFile: string | null,
  textureFile: string | null
) => {
  document.title = `${animFile ? animFile : "Untitled"} — ${
    textureFile ? textureFile : "No texture"
  }`;
};

if (process.env.NODE_ENV !== "development") {
  const bodyElement = document.querySelector("body");
  bodyElement?.addEventListener("contextmenu", (event) =>
    event.preventDefault()
  );
}

// const OUTPUT_VERSION_NUMBER = "2.0";

const App: React.FC = () => {
  const textureFileState = useState<HTMLImageElement | null>(null);
  const [appSection, setAppSection] = useState<AppSection>("layers");

  const [fileName, setFileName] = useState<string | null>(null);
  const [textureFileName, setTextureFileName] = useState<string | null>(null);

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
        <ImageControlContext>
          <AppContext>
            <ScreenTranslationContext>
              {appSection === "layers" && (
                <Layers
                  menu={applicationMenu}
                  textureState={textureFileState}
                  onSectionChange={setAppSection}
                />
              )}
            </ScreenTranslationContext>
            <ScreenTranslationContext>
              {appSection === "composition" && (
                <Composition
                  menu={applicationMenu}
                  textureState={textureFileState}
                  onSectionChange={setAppSection}
                />
              )}
            </ScreenTranslationContext>
          </AppContext>
        </ImageControlContext>
      </FileContext>
    </ThemeProvider>
  );
};

export default App;
