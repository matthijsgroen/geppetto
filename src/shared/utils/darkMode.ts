export const isInDarkMode = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches;

export const updateDarkModeClass = () => {
  // On page load or when changing themes, best to add inline in `head` to avoid FOUC
  document.documentElement.classList.toggle(
    "dark",
    localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
  );
};

export const preferDarkMode = () => {
  // Whenever the user explicitly chooses light mode
  localStorage.theme = "light";
  updateDarkModeClass();
};

export const preferLightMode = () => {
  // Whenever the user explicitly chooses dark mode
  localStorage.theme = "dark";
  updateDarkModeClass();
};

export const respectOSColorScheme = () => {
  // Whenever the user explicitly chooses to respect the OS preference
  localStorage.removeItem("theme");
  updateDarkModeClass();
};

export const watchSystemColorSchemeChanges = () => {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", () => {
    if (!("theme" in localStorage)) {
      updateDarkModeClass();
    }
  });
};
