import { withThemeByClassName } from "@storybook/addon-themes";
import { definePreview } from "@storybook/react-vite";
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
    options: {
      storySort: {
        order: [
          "Foundations",
          "Atoms",
          "Molecules",
          "Organisms",
          "Templates",
          "Pages",
        ],
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
