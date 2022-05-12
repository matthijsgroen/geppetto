export const colorScheme = {
  darkMode: true,
};

const colorSchemeListener = ({
  matches,
}: MediaQueryListEvent | MediaQueryList) => {
  colorScheme.darkMode = matches;
};

const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
colorSchemeListener(mediaQuery);
mediaQuery.addEventListener("change", colorSchemeListener);
