import { defineMain } from "@storybook/react-vite/node";

export default defineMain({
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["@storybook/addon-themes", "@storybook/addon-docs"],
  framework: "@storybook/react-vite",
});
