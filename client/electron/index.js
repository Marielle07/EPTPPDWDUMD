const path = require("path");
const { app, BrowserWindow } = require("electron");
const ipc = require("electron").ipcMain;
const port = require("./scripts/port");
const { network } = require("./scripts/network");

const isDev = process.env.IS_DEV == "true" ? true : false;

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  // win.loadFile("index.html");
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../dist/index.html")}`
  );
  // Open the DevTools.
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();
  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  const device = port.device();
  const n = network();
  var recorder;

  ipc.handle("toggle-port", () => {
    device.togglePort();
  });

  ipc.handle("record-activity", (e, activityName) => {
    recorder = device.recordActivity(activityName);
  });

  ipc.handle("record-activity-start", () => {
    recorder.start();
  });

  ipc.handle("record-activity-stop", () => {
    recorder.stop();
  });

  ipc.handle("load-data", (e, activityName) => {
    n.loadFile(activityName);
  });

  ipc.handle("create-model", async () => {
    await n.createModel();
  });

  // ipc.handle("start", async (event, data) => {
  //   //console.log(data);
  //   await reader.readData();
  //   await reader.runWorker(data);
  //   console.log("completed");
  //   return;
  // });
  // ipc.handle("train", async (event, data) => {
  //   await require("./scripts/model_generator");
  //   console.log("Trained!");
  //   return;
  // });

  // ipc.handle("prototype", async (event, data) => {
  //   console.log(data);
  //   await prototype.runWorker(JSON.parse(data));

  //   return;
  // });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
