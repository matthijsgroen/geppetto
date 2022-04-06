import { ThemeProvider } from "styled-components";
import { defaultTheme } from "../src/application/theme/default";
import "../src/index.css";

export const parameters = {
  backgrounds: { disable: true },
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
      items: ["light", "dark", "both"],
      // Property that specifies if the name of the item will be displayed
      showName: false,
    },
  },
};

const withThemeProvider = (Story, context) => {
  const theme = context.globals.theme;
  if (theme === "both") {
    return (
      <ThemeProvider theme={defaultTheme}>
        <div className="light-theme background">
          <Story {...context} />
        </div>
        <div className="dark-theme background">
          <Story {...context} />
        </div>
      </ThemeProvider>
    );
  }

  const body = document.getElementsByTagName("body")[0];

  body.classList.remove("light-theme", "dark-theme");
  body.classList.add(theme === "light" ? "light-theme" : "dark-theme");

  return (
    <ThemeProvider theme={defaultTheme}>
      <Story {...context} />
    </ThemeProvider>
  );
};
export const decorators = [withThemeProvider];
