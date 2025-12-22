import addonDocs from "@storybook/addon-docs";
import { withThemeByClassName } from "@storybook/addon-themes";
import { definePreview } from "@storybook/react-vite";
import "../src/ui/index.css";

export default definePreview({
  addons: [addonDocs()],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      disableSaveFromUI: true,
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
