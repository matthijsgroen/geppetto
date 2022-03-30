import { ThemeProvider } from "styled-components";
import { defaultTheme } from "../src/application/theme/default";
import "../src/index.css";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const globalTypes = {
  theme: {
    name: "Theme",
    description: "Global theme for components",
    defaultValue: "light",
    toolbar: {
      icon: "circlehollow",
      // Array of plain string values or MenuItem shape (see below)
      items: ["light", "dark"],
      // Property that specifies if the name of the item will be displayed
      showName: false,
    },
  },
};

const withThemeProvider = (Story, context) => {
  const body = document.getElementsByTagName("body")[0];

  body.classList.remove("light-theme", "dark-theme");
  body.classList.add(
    context.globals.theme === "light" ? "light-theme" : "dark-theme"
  );

  return (
    <ThemeProvider theme={defaultTheme}>
      <Story {...context} />
    </ThemeProvider>
  );
};
export const decorators = [withThemeProvider];
