import React, { useEffect, useState } from "react";
import { Layers } from "./layers/Layers";
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
  );
};

export default App;
