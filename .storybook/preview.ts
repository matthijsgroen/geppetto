import { definePreview } from "@storybook/react-vite";
import { withThemeByClassName } from "@storybook/addon-themes";
import "../src/index.css";

export default definePreview({
  addons: [],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    withThemeByClassName({
      themes: {
        light: "light",
        dark: "dark",
      },
      defaultTheme: "light",
    }),
  ],
  initialGlobals: {
    theme: "light",
  },
});
