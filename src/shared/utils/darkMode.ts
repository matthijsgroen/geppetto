let isDark: boolean = false;

export const isInDarkMode = () => isDark;

export const updateDarkModeClass = () => {
  const updateIsDark =
    localStorage.theme === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  const newPreference = userPreferences();

  if (isDark !== updateIsDark || userPreference !== newPreference) {
    isDark = updateIsDark;
    userPreference = newPreference;
    listeners.forEach((listener) => listener());
  }
  // On page load or when changing themes, best to add inline in `head` to avoid FOUC (FOUC stands for Flash of Unstyled Content)
  document.documentElement.classList.toggle("dark", updateIsDark);
};

type Listener = () => void;

const listeners: Listener[] = [];

export const userPreferences = (): "dark" | "light" | "system" => {
  if (localStorage.theme === "dark") {
    return "dark";
  } else if (localStorage.theme === "light") {
    return "light";
  } else {
    return "system";
  }
};

let userPreference: "dark" | "light" | "system" = userPreferences();

export const listenToDarkModeChanges = (listener: Listener) => {
  listeners.push(listener);
  return () => {
    const index = listeners.indexOf(listener);
    if (index !== -1) {
      listeners.splice(index, 1);
    }
  };
};

export const preferDarkMode = () => {
  // Whenever the user explicitly chooses dark mode
  localStorage.theme = "dark";
  updateDarkModeClass();
};

export const preferLightMode = () => {
  // Whenever the user explicitly chooses light mode
  localStorage.theme = "light";
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
