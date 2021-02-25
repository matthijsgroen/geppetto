import React, { useEffect, useState } from "react";
import { DefaultTheme, ThemeProvider } from "styled-components";
import AppLayout from "./templates/AppLayout";
import TabIcon from "./components/TabIcon";
import IconBar from "./components/IconBar";
import Layers from "./screens/Layers";
import Composition from "./screens/Composition";
import Animation from "./screens/Animation";

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
  Animation,
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
  const [textureFileName, setTextureFilename] = useState<string | null>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const animationFileContentsLoaded = (
      _event: Electron.IpcRendererEvent,
      _path: string,
      baseName: string,
      contents: string
    ) => {
      setImageDefinition((JSON.parse(contents) as unknown) as ImageDefinition);
      setBaseFilename(baseName);
    };
    ipcRenderer.on(
      "animation-file-contents-loaded",
      animationFileContentsLoaded
    );
    const animationFileNew = () => {
      setImageDefinition(newDefinition());
      setBaseFilename(null);
    };
    ipcRenderer.on("animation-file-new", animationFileNew);
    const animationFileNameChange = (
      _event: Electron.IpcRendererEvent,
      _path: string,
      baseName: string
    ) => {
      setBaseFilename(baseName);
    };
    ipcRenderer.on("animation-file-name-change", animationFileNameChange);

    const textureFileLoaded = (
      _event: Electron.IpcRendererEvent,
      path: string,
      baseName: string
    ) => {
      setTextureFilename(baseName);
      loadImage(path).then((image) => setImage(image));
    };
    ipcRenderer.on("texture-file-loaded", textureFileLoaded);

    return () => {
      ipcRenderer.off(
        "animation-file-contents-loaded",
        animationFileContentsLoaded
      );
      ipcRenderer.off("animation-file-new", animationFileNew);
      ipcRenderer.off("animation-file-name-change", animationFileNameChange);
      ipcRenderer.off("texture-file-loaded", textureFileLoaded);
    };
  }, []);

  useEffect(() => {
    ipcRenderer.send(
      "animation-file-contents-changed",
      JSON.stringify(imageDefinition)
    );
  }, [imageDefinition]);

  useEffect(() => {
    updateWindowTitle(baseFileName, textureFileName);
  }, [baseFileName, textureFileName]);

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
        <TabIcon
          icon="🏃‍♂️"
          title="Animation"
          active={activeItem === MenuItems.Animation}
          onClick={() => setActiveItem(MenuItems.Animation)}
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
      />
    ) : activeItem === MenuItems.Composition ? (
      <Composition
        texture={image}
        imageDefinition={imageDefinition}
        updateImageDefinition={setImageDefinition}
      />
    ) : (
      <Animation
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
