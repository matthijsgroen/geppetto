import React, { useEffect, useRef, useState } from "react";
import { DefaultTheme, ThemeProvider } from "styled-components";
import AppLayout from "./templates/AppLayout";
import TabIcon from "./components/TabIcon";
import IconBar from "./components/IconBar";
import Layers from "./screens/Layers";
import Composition from "./screens/Composition";
import Animation from "./screens/Animation";

import { ImageDefinition, ShapeDefinition } from "./lib/types";
import { newDefinition } from "./lib/definitionHelpers";
import { compressFile } from "./lib/compressFile";

const defaultTheme: DefaultTheme = {
  colors: {
    background: "var(--colors-background)",
    backgroundDestructive: "var(--colors-background-destructive)",
    backgroundSecondary: "var(--colors-background-secondary)",
    backgroundSelected: "var(--colors-background-selected)",
    itemContainerBackground: "var(--colors-item-container-background)",
    itemSelected: "var(--colors-item-selected)",
    itemSpecial: "var(--colors-item-special)",
    text: "var(--colors-text)",
    textSelected: "var(--colors-text-selected)",
  },
};

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

const App: React.FC = () => {
  const [activeItem, setActiveItem] = useState(MenuItems.Layers);
  const [imageDefinition, setImageDefinition] = useState<ImageDefinition>(
    newDefinition()
  );
  const [baseFileName, setBaseFilename] = useState<string | null>(null);
  const [textureFileName, setTextureFilename] = useState<string | null>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [showFPS, setShowFPS] = useState<boolean>(false);

  const imageDefRef = useRef(imageDefinition);

  useEffect(() => {
    if (!window.electron) return;

    window.electron.onAnimationFileLoaded((image, baseName) => {
      setImageDefinition(image);
      setBaseFilename(baseName);
    });
    window.electron.onAnimationFileNew(() => {
      setImageDefinition(newDefinition());
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
