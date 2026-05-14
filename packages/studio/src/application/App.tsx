import React, { useEffect, useState } from "react";

import { type AppSection } from "@/dtos/application.dto";
import { Curves } from "@/ui/components";

import { AnimationModule } from "./modules/animation/AnimationModule";
import { ApplicationMenu } from "./modules/application-menu/ui/ApplicationMenu";
import { CompositionModule } from "./modules/composition/CompositionModule";
import { LayersModule } from "./modules/layers/LayersModule";
import { AppContext } from "./state/ApplicationContext";
import { FileContext } from "./state/FileContext";
import { ImageControlProvider } from "./state/ImageControlContext";
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
  const [textureFile, setTextureFile] = useState<HTMLImageElement | null>(null);
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
      textureFileState={[textureFile, setTextureFile]}
    />
  );

  return (
    <FileContext>
      <Curves />
      <ImageControlProvider>
        <AppContext>
          <ScreenTranslationContext>
            {appSection === "layers" && (
              <LayersModule
                menu={applicationMenu}
                onSectionChange={setAppSection}
                texture={textureFile}
              />
            )}
          </ScreenTranslationContext>
          <ScreenTranslationContext>
            {appSection === "composition" && (
              <CompositionModule
                menu={applicationMenu}
                onSectionChange={setAppSection}
                texture={textureFile}
              />
            )}
          </ScreenTranslationContext>
          <ScreenTranslationContext>
            {appSection === "animation" && (
              <AnimationModule
                menu={applicationMenu}
                onSectionChange={setAppSection}
                texture={textureFile}
              />
            )}
          </ScreenTranslationContext>
        </AppContext>
      </ImageControlProvider>
    </FileContext>
  );
};

export default App;
