import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./application/App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

const rootNode = document.getElementById("root")!;
const root = ReactDOM.createRoot(rootNode);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

/**
 * Add Install to home screen using:
 * https://developer.chrome.com/blog/a2hs-updates/
 */

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();
