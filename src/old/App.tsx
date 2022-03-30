import React, { useEffect, useRef, useState } from "react";
import { ThemeProvider } from "styled-components";
import AppLayout from "./templates/AppLayout";
import TabIcon from "./components/TabIcon";
import IconBar from "./components/IconBar";
import Layers from "./screens/Layers";
import Composition from "./screens/Composition";
import Animation from "./screens/Animation";

import { ImageDefinition, ShapeDefinition } from "../animation/file1/types";
import { newFile } from "../animation/file1/new";
import { compressFile } from "./lib/compressFile";
import { updateVersionNumber } from "../animation/updateVersionNumber";
import { defaultTheme } from "../application/theme/default";

enum MenuItems {
  Layers,
  Composition,
  Animation,
}

const updateWindowTitle = (
  animFile: string | null,
  textureFile: string | null
) => {
  document.title = `${animFile ? animFile : "Untitled"} — ${
    textureFile ? textureFile : "No texture"
  }`;
};

const hasShapes = (shapes: ShapeDefinition[]): boolean =>
  shapes.some(
    (s) =>
      (s.type === "sprite" && s.points.length > 2) ||
      (s.type === "folder" && hasShapes(s.items))
  );

const OUTPUT_VERSION_NUMBER = "1.1";

const App: React.FC = () => {
  const [activeItem, setActiveItem] = useState(MenuItems.Layers);
  const [imageDefinition, setImageDefinition] = useState<ImageDefinition>(
    newFile()
  );
  const [baseFileName, setBaseFilename] = useState<string | null>(null);
  const [textureFileName, setTextureFilename] = useState<string | null>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [showFPS, setShowFPS] = useState<boolean>(false);

  const imageDefRef = useRef(imageDefinition);

  useEffect(() => {
    if (!window.electron) return;

    window.electron.onAnimationFileLoaded((image, baseName) => {
      setImageDefinition(updateVersionNumber(image, OUTPUT_VERSION_NUMBER));
      setBaseFilename(baseName);
    });
    window.electron.onAnimationFileNew(() => {
      setImageDefinition(updateVersionNumber(newFile(), OUTPUT_VERSION_NUMBER));
      setBaseFilename(null);
    });
    window.electron.onAnimationFileNameChange((newName) => {
      setBaseFilename(newName);
    });
    window.electron.onTextureFileLoaded((base64, baseName) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.addEventListener("load", () => {
        setTextureFilename(baseName);
        setImage(img);
      });
      img.src = `data:image/png;base64,${base64}`;
    });
    window.electron.onShowFPSChange((showFPS) => {
      setShowFPS(showFPS);
    });
    window.electron.onExportForWeb(() => compressFile(imageDefRef.current));
  }, []);

  useEffect(() => {
    if (window.electron) {
      window.electron.updateAnimationFile(imageDefinition);
    }
    imageDefRef.current = imageDefinition;
  }, [imageDefinition]);

  useEffect(() => {
    updateWindowTitle(baseFileName, textureFileName);
  }, [baseFileName, textureFileName]);

  const zoomState = useState(1.0);
  const panXState = useState(0.0);
  const panYState = useState(0.0);

  const compositionEnabled =
    textureFileName !== null && hasShapes(imageDefinition.shapes);

  const animationEnabled =
    compositionEnabled && imageDefinition.controls.length > 0;

  const icons = (
    <IconBar
      topIcons={[
        <TabIcon
          icon="🧬"
          title="Layers"
          active={activeItem === MenuItems.Layers}
          onClick={() => setActiveItem(MenuItems.Layers)}
          key="layers"
        />,
        <TabIcon
          icon="🤷🏼"
          title="Composition"
          disabled={!compositionEnabled}
          active={activeItem === MenuItems.Composition}
          onClick={() =>
            compositionEnabled && setActiveItem(MenuItems.Composition)
          }
          key="composition"
        />,
        <TabIcon
          icon="🏃‍♂️"
          title="Animation"
          disabled={!animationEnabled}
          active={activeItem === MenuItems.Animation}
          onClick={() => animationEnabled && setActiveItem(MenuItems.Animation)}
          key="animation"
        />,
      ]}
    />
  );

  const screen =
    activeItem === MenuItems.Layers ? (
      <Layers
        texture={image}
        imageDefinition={imageDefinition}
        updateImageDefinition={setImageDefinition}
        showFPS={showFPS}
      />
    ) : activeItem === MenuItems.Composition ? (
      <Composition
        texture={image}
        imageDefinition={imageDefinition}
        updateImageDefinition={setImageDefinition}
        showFPS={showFPS}
        zoomState={zoomState}
        panXState={panXState}
        panYState={panYState}
      />
    ) : (
      <Animation
        texture={image}
        imageDefinition={imageDefinition}
        updateImageDefinition={setImageDefinition}
        showFPS={showFPS}
        zoomState={zoomState}
        panXState={panXState}
        panYState={panYState}
      />
    );

  return (
    <ThemeProvider theme={defaultTheme}>
      <AppLayout icons={icons} screen={screen} />
    </ThemeProvider>
  );
};

export default App;
