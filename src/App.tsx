import React, { useMemo, useState } from "react";
import { DefaultTheme, ThemeProvider } from "styled-components";
import TextureMapCanvas from "./animation/TextureMapCanvas";
import Menu from "./components/Menu";
import AppLayout from "./templates/AppLayout";
import texture from "./data/hiddo-texture.png";
import MenuItem from "./components/MenuItem";
import imageDefinition from "./data/hiddo";
import TabIcon from "./components/TabIcon";

const defaultTheme: DefaultTheme = {
  colors: {
    background: "#333333",
    text: "#999999",
    backgroundSelected: "#444444",
    textSelected: "white",
  },
};

enum MenuItems {
  Layers,
  Composition,
}

const App: React.FC = () => {
  const [activeItem, setActiveItem] = useState(MenuItems.Layers);

  const menu = useMemo(() => {
    if (activeItem === MenuItems.Layers) {
      return (
        <Menu title="Layers">
          {imageDefinition.shapes.map((shape) => (
            <MenuItem key={shape.name} name={shape.name} />
          ))}
        </Menu>
      );
    }
    return undefined;
  }, [activeItem]);

  const main = useMemo(() => {
    if (activeItem === MenuItems.Layers) {
      return <TextureMapCanvas url={texture} shapes={imageDefinition.shapes} />;
    }
    return undefined;
  }, [activeItem]);

  return (
    <ThemeProvider theme={defaultTheme}>
      <AppLayout
        icons={[
          <TabIcon
            icon="🧬"
            title="Layers"
            active={activeItem === MenuItems.Layers}
            onClick={() => setActiveItem(MenuItems.Layers)}
          />,
          <TabIcon
            icon="🤷🏼"
            title="Composition"
            active={activeItem === MenuItems.Composition}
            onClick={() => setActiveItem(MenuItems.Composition)}
          />,
        ]}
        menu={menu}
        main={main}
      />
    </ThemeProvider>
  );
};

export default App;
