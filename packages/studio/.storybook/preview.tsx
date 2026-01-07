import addonDocs from "@storybook/addon-docs";
import { withThemeByClassName } from "@storybook/addon-themes";
import { definePreview } from "@storybook/react-vite";
import "@/ui/index.css";
import { Curves } from "@/ui/components";

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
    (Story) => (
      <>
        <Curves />
        <Story />
      </>
    ),
  ],
  initialGlobals: {
    theme: "light",
  },
});
