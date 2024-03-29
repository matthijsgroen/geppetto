import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./application/App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import { setAppUpdate } from "./application/hooks/useAppUpdate";

const rootNode = document.getElementById("root")!;
const root = ReactDOM.createRoot(rootNode);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

/**
 * TODO: Add .register({
 *   onSuccess: () => {
 *     // notify that app can be used offline
 *   },
 * })
 */

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    if (registration.waiting) {
      const nextUpdate = registration.waiting;
      setAppUpdate(() => {
        nextUpdate.postMessage({ type: "SKIP_WAITING" });
        window.location.reload();
      });
    }
  },
});
