export const colorScheme = {
  darkMode: true,
};

const colorSchemeListener = ({
  matches,
}: MediaQueryListEvent | MediaQueryList) => {
  colorScheme.darkMode = matches;

  const themeColor = document.querySelector("meta[name='theme-color']");
  if (matches) {
    themeColor?.setAttribute("content", "#35363a");
  } else {
    themeColor?.setAttribute("content", "#e7eaed");
  }
};

const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
colorSchemeListener(mediaQuery);
mediaQuery.addEventListener("change", colorSchemeListener);
