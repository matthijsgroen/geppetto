import React, { useMemo, useState } from "react";
import { DefaultTheme, ThemeProvider } from "styled-components";
import TextureMapCanvas from "./animation/TextureMapCanvas";
import CompositionCanvas from "./animation/CompositionCanvas";
import Menu from "./components/Menu";
import AppLayout from "./templates/AppLayout";
import texture from "./data/hiddo-texture.png";
import MenuItem from "./components/MenuItem";
import imageDefinition from "./data/hiddo";
import TabIcon from "./components/TabIcon";
import SliderControl from "./components/SliderControl";

const defaultTheme: DefaultTheme = {
  colors: {
    background: "#333",
    backgroundSecondary: "#444",
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
  const [zoom, setZoom] = useState(1.0);

  const menu = useMemo(() => {
    if (activeItem === MenuItems.Layers) {
      return (
        <Menu title="Layers">
          {imageDefinition.shapes.map((shape) => (
            <MenuItem
              key={shape.name}
              name={`${shape.name} (${shape.points.length})`}
            />
          ))}
        </Menu>
      );
    }
    return undefined;
  }, [activeItem]);

  const main = useMemo(() => {
    if (activeItem === MenuItems.Layers) {
      return (
        <TextureMapCanvas
          url={texture}
          shapes={imageDefinition.shapes}
          zoom={zoom}
        />
      );
    }
    if (activeItem === MenuItems.Composition) {
      return (
        <CompositionCanvas url={texture} shapes={imageDefinition.shapes} />
      );
    }
    return undefined;
  }, [activeItem, zoom]);

  const tools = useMemo(() => {
    if (activeItem === MenuItems.Layers) {
      return [
        <SliderControl
          key="zoom"
          value={zoom}
          min={0.1}
          max={4.0}
          step={0.05}
          onChange={setZoom}
        />,
      ];
    }
    return undefined;
  }, [activeItem, zoom, setZoom]);

  return (
    <ThemeProvider theme={defaultTheme}>
      <AppLayout
        icons={[
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
        tools={tools}
        menu={menu}
        main={main}
      />
    </ThemeProvider>
  );
};

export default App;
