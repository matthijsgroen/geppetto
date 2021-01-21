import React from "react";
import { DefaultTheme, ThemeProvider } from "styled-components";
import TextureMapCanvas from "./animation/TextureMapCanvas";
import Menu from "./components/Menu";
import AppLayout from "./templates/AppLayout";
import texture from "./data/hiddo-texture.png";
import MenuItem from "./components/MenuItem";

const defaultTheme: DefaultTheme = {
  colors: {
    background: "#333333",
  },
};

const imageDefinition = {
  shapes: [
    { name: "leftEyeBrow" },
    { name: "rightEyeBrow" },
    { name: "leftEye" },
  ],
};

const App: React.FC = () => (
  <ThemeProvider theme={defaultTheme}>
    <AppLayout
      menu={
        <Menu title="Layers">
          {imageDefinition.shapes.map((shape) => (
            <MenuItem key={shape.name} name={shape.name} />
          ))}
        </Menu>
      }
      main={<TextureMapCanvas url={texture} />}
    />
  </ThemeProvider>
);

export default App;
