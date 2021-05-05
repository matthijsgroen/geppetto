const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  onAnimationFileLoaded: (callback) => {
    ipcRenderer.on(
      "animation-file-contents-loaded",
      (_event, _path, baseName, contents) => {
        callback(JSON.parse(contents), baseName);
      }
    );
  },
  onAnimationFileNew: (callback) => {
    ipcRenderer.on("animation-file-new", () => callback());
  },
  onAnimationFileNameChange: (callback) => {
    ipcRenderer.on("animation-file-name-change", (_event, _path, baseName) =>
      callback(baseName)
    );
  },
  onTextureFileLoaded: (callback) => {
    ipcRenderer.on("texture-file-loaded", (_event, image, baseName) => {
      callback(image, baseName);
    });
  },
  onShowFPSChange: (callback) => {
    ipcRenderer.on("show-fps", (_event, value) => callback(value));
  },
  onExportForWeb: (prepareExport) => {
    ipcRenderer.on("export-as", () => {
      const contents = prepareExport();
      ipcRenderer.send("animation-file-export", JSON.stringify(contents));
    });
  },
  updateAnimationFile: (contents) => {
    ipcRenderer.send(
      "animation-file-contents-changed",
      JSON.stringify(contents)
    );
  },
});
