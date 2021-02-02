import React, { useState } from "react";
import { DefaultTheme, ThemeProvider } from "styled-components";
import AppLayout from "./templates/AppLayout";
import TabIcon from "./components/TabIcon";
import IconBar from "./components/IconBar";
import Layers from "./screens/Layers";
import Composition from "./screens/Composition";

import texture from "./data/hiddo-texture.png";
import { ImageDefinition } from "./lib/types";
import FileContentDialog from "./screens/FileContentDialog";
import { newDefinition } from "./lib/definitionHelpers";

const defaultTheme: DefaultTheme = {
  colors: {
    background: "#333",
    backgroundSecondary: "#444",
    itemContainerBackground: "#111",
    text: "#999",
    backgroundSelected: "#444",
    textSelected: "white",
  },
};

enum MenuItems {
  Layers,
  Composition,
}

const App: React.FC = () => {
  const [activeItem, setActiveItem] = useState(MenuItems.Layers);
  const [imageDefinition, setImageDefinition] = useState<ImageDefinition>(
    newDefinition()
  );
  const [fileContentOpen, setFileContentOpen] = useState<boolean>(false);

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
      bottomIcons={[
        <TabIcon
          icon="⚙"
          title="Settings"
          onClick={() => setFileContentOpen(true)}
          key="settings"
        />,
      ]}
    />
  );

  const screen =
    activeItem === MenuItems.Layers ? (
      <Layers
        texture={texture}
        imageDefinition={imageDefinition}
        updateImageDefinition={setImageDefinition}
      />
    ) : (
      <Composition
        texture={texture}
        imageDefinition={imageDefinition}
        updateImageDefinition={setImageDefinition}
      />
    );

  return (
    <ThemeProvider theme={defaultTheme}>
      {fileContentOpen && (
        <FileContentDialog
          imageDefinition={imageDefinition}
          onUpdate={setImageDefinition}
          onClose={() => setFileContentOpen(false)}
        />
      )}
      <AppLayout icons={icons} screen={screen} />
    </ThemeProvider>
  );
};

export default App;
