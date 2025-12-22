import React, { useEffect, useState } from "react";

import { ApplicationMenu } from "./use-cases/application-menu/ui/ApplicationMenu";
import { Composition } from "./use-cases/composition/ui/Composition";
import { AppContext } from "./state/ApplicationContext";
import { FileContext } from "./state/FileContext";
import { ImageControlContext } from "./state/ImageControlContext";
import { ScreenTranslationContext } from "./state/ScreenTranslationContext";
import { Layers } from "./use-cases/layers/ui/Layers";
import { type AppSection } from "../dtos/application.dto";

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
