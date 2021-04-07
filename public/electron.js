// eslint-env node
const { app, BrowserWindow, Menu, dialog } = require("electron");
const util = require("util");
const readFile = util.promisify(require("fs").readFile);
const writeFile = util.promisify(require("fs").writeFile);
const path = require("path");
const isDev = require("electron-is-dev");

const LINK_BASE_URL = "https://github.com/matthijsgroen/gepetto";

/**
 * type EditorWindow = {
 *   window: BrowserWindow;
 *   filePath: string;
 *   fileContents: string;
 *   changed: boolean;
 *   showFPS: boolean;
 * }
 *
 * windows: EditorWindow[]
 */
let windows = [];

const isMac = process.platform === "darwin";
const template = [
  ...(isMac
    ? [
        {
          role: "appMenu",
          submenu: [
            { role: "about" },
            { type: "separator" },
            { role: "services" },
            { type: "separator" },
            { role: "hide" },
            { role: "hideothers" },
            { role: "unhide" },
            { type: "separator" },
            { role: "quit" },
          ],
        },
      ]
    : []),
  {
    role: "fileMenu",
    submenu: [
      {
        label: "New",
        accelerator: "CmdOrCtrl+N",
        click() {
          newFile();
        },
      },
      {
        label: "Open",
        accelerator: "CmdOrCtrl+O",
        click() {
          openFile();
        },
      },
      {
        label: "Load texture",
        accelerator: "Shift+CmdOrCtrl+O",
        enabled: false,
        id: "loadTexture",
        click(_event, browserWindow) {
          loadTexture(browserWindow);
        },
      },
      {
        label: "Open Recent",
        role: "recentdocuments",
        submenu: [
          {
            label: "Clear Recent",
            role: "clearrecentdocuments",
          },
        ],
      },
      {
        label: "Save",
        accelerator: "CmdOrCtrl+S",
        enabled: false,
        id: "fileSave",
        click(_event, browserWindow) {
          saveFile(browserWindow, true);
        },
      },
      {
        label: "Save As...",
        accelerator: "Shift+CmdOrCtrl+S",
        enabled: false,
        id: "fileSaveAs",
        click(_event, browserWindow) {
          saveFile(browserWindow, false);
        },
      },
      { role: "close" },
      ...(isMac ? [] : [{ role: "quit" }]),
    ],
  },
  {
    role: "viewMenu",
    submenu: [
      {
        label: "Show FPS",
        enabled: false,
        type: "checkbox",
        id: "showFPS",
        click(_event, browserWindow) {
          const status = windows.find((w) => w.window === browserWindow);
          status.showFPS = !status.showFPS;

          const showFPSMenuItem = menu.getMenuItemById("showFPS");
          showFPSMenuItem.checked = status.showFPS;

          browserWindow.webContents.send("show-fps", status.showFPS);
        },
      },
      ...(isDev
        ? [
            { type: "separator" },
            { role: "reload" },
            { role: "forcereload" },
            { role: "toggledevtools" },
          ]
        : []),
    ],
  },
  {
    role: "windowMenu",
    submenu: [
      { role: "minimize" },
      { role: "zoom" },
      ...(isMac
        ? [{ type: "separator" }, { role: "front" }, { type: "separator" }]
        : [{ role: "close" }]),
    ],
  },
  {
    role: "help",
    submenu: [
      {
        label: "Documentation",
        click: async () => {
          const { shell } = require("electron");
          await shell.openExternal(`${LINK_BASE_URL}/wiki`);
        },
      },
      {
        label: "Report an issue",
        click: async () => {
          const { shell } = require("electron");
          await shell.openExternal(`${LINK_BASE_URL}/issues`);
        },
      },
      {
        label: "Share your work!",
        click: async () => {
          const { shell } = require("electron");
          await shell.openExternal(
            `${LINK_BASE_URL}/discussions/categories/show-and-tell`
          );
        },
      },
    ],
  },
];

const menu = Menu.buildFromTemplate(template);

const windowMenuItems = ["fileSave", "fileSaveAs", "loadTexture", "showFPS"];

const setItemsEnableState = (callback) => {
  windowMenuItems.forEach((item) => {
    const enabled = callback(item);
    const menuItem = menu.getMenuItemById(item);
    menuItem.enabled = enabled;
  });
};

const newDefinition = {
  animations: [],
  controlValues: {},
  controls: [],
  defaultFrame: {},
  shapes: [],
  version: "1.0",
};

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    backgroundColor: "#000",
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  win.setFullScreenable(false);
  win.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  const status = {
    window: win,
    filePath: null,
    fileContents: JSON.stringify(newDefinition),
    activeContents: "",
    changed: false,
    showFPS: false,
  };
  windows.push(status);
  win.once("ready-to-show", () => {
    win.show();
    win.focus();
  });

  win.on("close", (event) => {
    if (status.changed) {
      const result = dialog.showMessageBoxSync(win, {
        type: "warning",
        message: "You have unsaved changes. Continue?",
        buttons: ["Cancel", "Save changes", "Discard changes"],
        defaultId: 0,
        cancelId: 0,
      });
      if (result === 0) {
        event.preventDefault();
        return false;
      }
      if (result === 1) {
        event.preventDefault();
        saveFile(win, true).then((success) => {
          success && win.close();
        });
        return false;
      }
    }
    if (win.isFocused()) {
      setItemsEnableState(() => false);
    }
  });

  win.on("closed", () => {
    windows = windows.filter((w) => w.window !== win);
  });

  win.on("blur", () => {
    setItemsEnableState(() => false);
  });

  win.on("focus", () => {
    setItemsEnableState((item) =>
      item === "fileSave" ? status.changed : true
    );

    const showFPSMenuItem = menu.getMenuItemById("showFPS");
    showFPSMenuItem.checked = status.showFPS;
  });

  win.on("show", () => {
    if (win.isFocused()) {
      setItemsEnableState((item) =>
        item === "fileSave" ? status.changed : true
      );

      const showFPSMenuItem = menu.getMenuItemById("showFPS");
      showFPSMenuItem.checked = status.showFPS;
    }
  });

  win.webContents.on("ipc-message", (_event, channel, data) => {
    if (channel === "animation-file-contents-changed") {
      status.changed = status.fileContents !== data;
      status.activeContents = data;
      win.setDocumentEdited(status.changed);
      const item = menu.getMenuItemById("fileSave");
      item.enabled = status.changed;
    }
  });

  return win;
}

async function openFile() {
  const result = await dialog.showOpenDialog({
    filters: [{ name: "Animation file", extensions: ["json"] }],
  });
  if (!result.canceled) {
    loadFile(result.filePaths[0]);
  }
}

async function loadTexture(browserWindow) {
  const result = await dialog.showOpenDialog(browserWindow, {
    filters: [{ name: "Texture file", extensions: ["png"] }],
  });
  if (!result.canceled) {
    const filePath = result.filePaths[0];
    browserWindow.webContents.send(
      "texture-file-loaded",
      filePath,
      path.basename(filePath)
    );
  }
}

async function saveFile(browserWindow, useFilePath) {
  if (!browserWindow) {
    return false;
  }
  const status = windows.find((w) => w.window === browserWindow);
  let filePath = useFilePath ? status.filePath : null;
  if (filePath === null) {
    const defaultName =
      status && status.filePath
        ? path.basename(status.filePath)
        : "new-animation.json";
    const result = await dialog.showSaveDialog(browserWindow, {
      defaultPath: defaultName,
      filters: [{ name: "Animation file", extensions: ["json"] }],
    });
    if (result.canceled) {
      return false;
    }
    filePath = result.filePath;
  }

  await writeFile(filePath, JSON.stringify(JSON.parse(status.activeContents)));
  app.addRecentDocument(filePath);
  status.filePath = filePath;
  status.fileContents = status.activeContents;
  status.changed = false;
  status.window.setDocumentEdited(status.changed);
  status.window.setRepresentedFilename(filePath);

  const item = menu.getMenuItemById("fileSave");
  item.enabled = status.changed;

  const itemAs = menu.getMenuItemById("fileSaveAs");
  itemAs.enabled = true;

  browserWindow.webContents.send(
    "animation-file-name-change",
    filePath,
    path.basename(filePath)
  );
  return true;
}

function newFile() {
  const browserWindow = createWindow();
  browserWindow.setRepresentedFilename("");
  browserWindow.webContents.send("animation-file-new");
}

const updateContentToBrowser = (parsed, windowStatus, filePath) => {
  windowStatus.changed = false;
  windowStatus.filePath = filePath;
  windowStatus.fileContents = JSON.stringify(parsed);
  const browserWindow = windowStatus.window;

  browserWindow.setRepresentedFilename(filePath);
  browserWindow.webContents.send(
    "animation-file-contents-loaded",
    filePath,
    path.basename(filePath),
    windowStatus.fileContents
  );
};

async function loadFile(filePath) {
  const status = windows.find((w) => w.filePath === filePath);
  let browserWindow = null;

  if (status && status.changed) {
    const result = await dialog.showMessageBox(status.window, {
      message: "This will revert all unsaved changes. Continue?",
      buttons: ["Discard changes", "Cancel"],
      defaultId: 1,
      cancelId: 1,
    });
    if (result.response === 1) {
      return;
    }
    browserWindow = status.window;
  }

  const contents = await readFile(filePath, "utf8");
  try {
    const parsed = { ...newDefinition, ...JSON.parse(contents) };
    app.addRecentDocument(filePath);
    const emptyWindow = windows.find((e) => e.filePath === null && !e.changed);
    if (emptyWindow) {
      browserWindow = emptyWindow.window;
    }

    if (browserWindow === null) {
      browserWindow = createWindow();
      browserWindow.once("ready-to-show", () => {
        const windowStatus = windows.find((e) => e.window === browserWindow);
        updateContentToBrowser(parsed, windowStatus, filePath);
      });
    } else {
      const windowStatus = windows.find((e) => e.window === browserWindow);
      updateContentToBrowser(parsed, windowStatus, filePath);
    }
  } catch (e) {
    // Show error message dialog
    dialog.showErrorBox("Invalid file", "Error parsing file.");
  }
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("open-file", (e, path) => {
  loadFile(path);
});
Menu.setApplicationMenu(menu);
