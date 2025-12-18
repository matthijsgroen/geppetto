export const isInDarkMode = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches;
