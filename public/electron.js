// eslint-env node
const { app, BrowserWindow, Menu, dialog } = require("electron");
const util = require("util");
const readFile = util.promisify(require("fs").readFile);
const path = require("path");
const isDev = require("electron-is-dev");

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  win.setFullScreenable(false);
  win.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
}

function openFile() {
  const browserWindow = BrowserWindow.getAllWindows()[0];
  dialog
    .showOpenDialog(browserWindow, {
      filters: [{ name: "Animation file", extensions: ["json"] }],
    })
    .then((result) => {
      if (!result.canceled) {
        loadFile(result.filePaths[0]);
      }
    });
}

function newFile() {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }

  // Only if JSON file
  const browserWindow = BrowserWindow.getAllWindows()[0];
  browserWindow.setRepresentedFilename("");
  browserWindow.webContents.send("animation-file-new");
}

function loadFile(filePath) {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
  readFile(filePath, "utf8").then((contents) => {
    app.addRecentDocument(filePath);

    // Only if JSON file
    const browserWindow = BrowserWindow.getAllWindows()[0];
    browserWindow.setRepresentedFilename(filePath);
    browserWindow.webContents.send(
      "animation-file-contents-loaded",
      filePath,
      path.basename(filePath),
      contents
    );
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("open-file", (e, path) => {
  loadFile(path);
});

const isMac = process.platform === "darwin";
const template = [
  // { role: 'appMenu' }
  ...(isMac
    ? [
        {
          label: app.name,
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
  // { role: 'fileMenu' }
  ...(isMac
    ? [
        {
          label: "File",
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
              click() {
                saveFile();
              },
            },
          ],
        },
      ]
    : [
        {
          label: "File",
          submenu: [
            {
              label: "Open",
              accelerator: "CmdOrCtrl+O",
              click() {
                openFile();
              },
            },
            // {
            //   label: "Save",
            //   accelerator: "CmdOrCtrl+S",
            //   click() {
            //     saveFile();
            //   },
            // },
            isMac ? { role: "close" } : { role: "quit" },
          ],
        },
      ]),
  // { role: 'viewMenu' }
  ...(isDev
    ? [
        {
          label: "View",
          submenu: [
            { role: "reload" },
            { role: "forcereload" },
            { role: "toggledevtools" },
            { type: "separator" },
          ],
        },
      ]
    : []),
  // { role: 'windowMenu' }
  {
    label: "Window",
    submenu: [
      { role: "minimize" },
      { role: "zoom" },
      ...(isMac
        ? [
            { type: "separator" },
            { role: "front" },
            { type: "separator" },
            { role: "window" },
          ]
        : [{ role: "close" }]),
    ],
  },
  {
    role: "help",
    submenu: [
      {
        label: "Learn More",
        click: async () => {
          const { shell } = require("electron");
          await shell.openExternal("https://electronjs.org");
        },
      },
    ],
  },
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
