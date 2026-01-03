import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";

import App from "./application/App";
import { setAppUpdate } from "./application/state/hooks/useAppUpdate";
import {
  updateDarkModeClass,
  watchSystemColorSchemeChanges,
} from "./shared/utils/darkMode";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

updateDarkModeClass();
watchSystemColorSchemeChanges();

// Register service worker
const updateSW = registerSW({
  onNeedRefresh() {
    setAppUpdate(() => {
      updateSW(true);
    });
  },
  onOfflineReady() {
    // App is ready to work offline
  },
});
