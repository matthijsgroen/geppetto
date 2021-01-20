import React from "react";
import { DefaultTheme, ThemeProvider } from "styled-components";
import TextureMapCanvas from "./animation/TextureMapCanvas";
import Menu from "./components/Menu";
import AppLayout from "./templates/AppLayout";

const defaultTheme: DefaultTheme = {
  colors: {
    background: "#333333",
  },
};

const App: React.FC = () => (
  <ThemeProvider theme={defaultTheme}>
    <AppLayout menu={<Menu title="Layers" />} main={<TextureMapCanvas />} />
  </ThemeProvider>
);

export default App;
