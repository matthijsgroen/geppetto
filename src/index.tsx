import { watch } from "fs";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./application/App";
import {
  updateDarkModeClass,
  watchSystemColorSchemeChanges,
} from "./application/lib/darkMode";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

updateDarkModeClass();
watchSystemColorSchemeChanges();
