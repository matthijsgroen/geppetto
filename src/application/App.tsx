import React, { useEffect, useState } from "react";

import { type AppSection } from "@/dtos/application.dto";

import { ApplicationMenu } from "./modules/application-menu/ui/ApplicationMenu";
import { Composition } from "./modules/composition/ui/Composition";
import { Layers } from "./modules/layers/ui/Layers";
import { AppContext } from "./state/ApplicationContext";
import { FileContext } from "./state/FileContext";
import { ImageControlContext } from "./state/ImageControlContext";
import { ScreenTranslationContext } from "./state/ScreenTranslationContext";

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
