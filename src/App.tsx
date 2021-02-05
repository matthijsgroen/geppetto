import React, { useEffect, useState } from "react";
import { DefaultTheme, ThemeProvider } from "styled-components";
import AppLayout from "./templates/AppLayout";
import TabIcon from "./components/TabIcon";
import IconBar from "./components/IconBar";
import Layers from "./screens/Layers";
import Composition from "./screens/Composition";

import texture from "./data/hiddo-texture.png";
import { ImageDefinition } from "./lib/types";
import { newDefinition } from "./lib/definitionHelpers";
import { loadImage } from "./lib/webgl";
import { ipcRenderer } from "electron";

const defaultTheme: DefaultTheme = {
  colors: {
    background: "#333",
    backgroundSecondary: "#444",
    itemContainerBackground: "#111",
    text: "#999",
    backgroundSelected: "#666",
    textSelected: "white",
  },
};

enum MenuItems {
  Layers,
  Composition,
}

const updateWindowTitle = (
  animFile: string | null,
  textureFile: string | null
) => {
  document.title = `${animFile ? animFile : "Untitled"} - ${
    textureFile ? textureFile : "No texture"
  }`;
};

const App: React.FC = () => {
  const [activeItem, setActiveItem] = useState(MenuItems.Layers);
  const [imageDefinition, setImageDefinition] = useState<ImageDefinition>(
    newDefinition()
  );
  const [baseFileName, setBaseFilename] = useState<string | null>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    loadImage(texture).then((image) => setImage(image));
  }, []);

  useEffect(() => {
    ipcRenderer.on(
      "animation-file-contents-loaded",
      (_event, _path, baseName, contents) => {
        setImageDefinition(
          (JSON.parse(contents) as unknown) as ImageDefinition
        );
        setBaseFilename(baseName);
      }
    );
    ipcRenderer.on("animation-file-new", () => {
      setImageDefinition(newDefinition());
      setBaseFilename(null);
    });
  }, []);

  useEffect(() => {
    updateWindowTitle(baseFileName, null);
  }, [baseFileName]);

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
          active={activeItem === MenuItems.Composition}
          onClick={() => setActiveItem(MenuItems.Composition)}
          key="composition"
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
      />
    ) : (
      <Composition
        texture={image}
        imageDefinition={imageDefinition}
        updateImageDefinition={setImageDefinition}
      />
    );

  return (
    <ThemeProvider theme={defaultTheme}>
      <AppLayout icons={icons} screen={screen} />
    </ThemeProvider>
  );
};

export default App;
