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
import MouseControl, { MouseMode } from "./components/MouseControl";

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
  const [panX, setPanX] = useState(0.0);
  const [panY, setPanY] = useState(0.0);
  const [mouseCoordinates, setMouseCoordinates] = useState<
    null | [number, number]
  >(null);
  const [isMouseDown, setIsMouseDown] = useState<false | [number, number]>(
    false
  );
  const [layerSelected, setLayerSelected] = useState<null | string>(null);

  const menu = useMemo(() => {
    if (activeItem === MenuItems.Layers) {
      return (
        <Menu title="Layers">
          {imageDefinition.shapes.map((shape) => (
            <MenuItem
              key={shape.name}
              selected={shape.name === layerSelected}
              name={`${shape.name} (${shape.points.length})`}
              onClick={() =>
                setLayerSelected(
                  shape.name === layerSelected ? null : shape.name
                )
              }
            />
          ))}
        </Menu>
      );
    }
    if (activeItem === MenuItems.Composition) {
      return (
        <Menu title="Composition">
          {imageDefinition.shapes.map((shape) => (
            <MenuItem
              key={shape.name}
              selected={shape.name === layerSelected}
              name={`${shape.name} (${shape.points.length})`}
              onClick={() =>
                setLayerSelected(
                  shape.name === layerSelected ? null : shape.name
                )
              }
            />
          ))}
        </Menu>
      );
    }
    return undefined;
  }, [activeItem, layerSelected]);

  const main = useMemo(() => {
    if (activeItem === MenuItems.Layers) {
      return (
        <TextureMapCanvas
          url={texture}
          shapes={imageDefinition.shapes}
          zoom={zoom}
          panX={panX}
          panY={panY}
          activeLayer={layerSelected}
          onMouseMove={setMouseCoordinates}
        />
      );
    }
    if (activeItem === MenuItems.Composition) {
      return (
        <CompositionCanvas
          url={texture}
          shapes={imageDefinition.shapes}
          zoom={zoom}
          panX={panX}
          panY={panY}
          activeLayer={layerSelected}
        />
      );
    }
    return undefined;
  }, [activeItem, zoom, panX, panY, layerSelected]);

  const tools = useMemo(() => {
    if (activeItem === MenuItems.Layers) {
      return [];
    }
    if (activeItem === MenuItems.Composition) {
      return [];
    }
    return undefined;
  }, [activeItem, zoom, panX, panY, mouseCoordinates]);

  const mouseMode = MouseMode.Grab;

  const mouseDown = (event: React.MouseEvent) => {
    const canvasPos = event.currentTarget.getBoundingClientRect();
    const elementX = event.pageX - canvasPos.left;
    const elementY = event.pageY - canvasPos.top;
    setIsMouseDown([elementX, elementY]);
  };

  const mouseMove = (event: React.MouseEvent) => {
    if (isMouseDown) {
      const canvasPos = event.currentTarget.getBoundingClientRect();
      const elementX = event.pageX - canvasPos.left;
      const elementY = event.pageY - canvasPos.top;
      setIsMouseDown([elementX, elementY]);
      const deltaX = elementX - isMouseDown[0];
      const deltaY = elementY - isMouseDown[1];

      const newPanX = Math.min(
        1.0,
        Math.max(
          panX + ((deltaX / canvasPos.width) * window.devicePixelRatio) / zoom,
          -1.0
        )
      );
      setPanX(newPanX);

      const newPanY = Math.min(
        1.0,
        Math.max(
          panY +
            ((deltaY / canvasPos.height) * window.devicePixelRatio * -1.0) /
              zoom,
          -1.0
        )
      );
      setPanY(newPanY);
    }
  };

  const mouseUp = () => {
    setIsMouseDown(false);
  };

  const mouseWheel = (delta: number) => {
    const z = Math.min(4.0, Math.max(0.1, zoom - delta / 100));
    setZoom(z);
  };

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
        main={
          <MouseControl
            mode={mouseMode}
            onMouseDown={mouseDown}
            onMouseMove={mouseMove}
            onMouseUp={mouseUp}
            onWheel={mouseWheel}
          >
            {main}
          </MouseControl>
        }
      />
    </ThemeProvider>
  );
};

export default App;
