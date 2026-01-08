import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { defineMain } from "@storybook/react-vite/node";

const getAbsolutePath = (packageName: string) =>
  dirname(
    fileURLToPath(import.meta.resolve(join(packageName, "package.json")))
  );

export default defineMain({
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    getAbsolutePath("@storybook/addon-themes"),
    getAbsolutePath("@storybook/addon-docs"),
    getAbsolutePath("@storybook/addon-vitest"),
  ],
  framework: { name: getAbsolutePath("@storybook/react-vite"), options: {} },
});
