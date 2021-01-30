import React, { useState } from "react";
import { DefaultTheme, ThemeProvider } from "styled-components";
import AppLayout from "./templates/AppLayout";
import texture from "./data/hiddo-texture.png";
import imageDefinition from "./data/hiddo";
import TabIcon from "./components/TabIcon";
import IconBar from "./components/IconBar";
import Layers from "./screens/Layers";
import Composition from "./screens/Composition";

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
          onClick={() => setActiveItem(MenuItems.Composition)}
          key="settings"
        />,
      ]}
    />
  );

  const screen =
    activeItem === MenuItems.Layers ? (
      <Layers texture={texture} imageDefinition={imageDefinition} />
    ) : (
      <Composition texture={texture} imageDefinition={imageDefinition} />
    );

  return (
    <ThemeProvider theme={defaultTheme}>
      <AppLayout icons={icons} screen={screen} />
    </ThemeProvider>
  );
};

export default App;
