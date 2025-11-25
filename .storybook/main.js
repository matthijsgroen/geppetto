module.exports = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],

  addons: [
    "@storybook/addon-links",
    "@storybook/preset-create-react-app",
    "@storybook/addon-docs"
  ],

  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },

  typescript: {
    reactDocgen: "react-docgen-typescript",
  }
};
