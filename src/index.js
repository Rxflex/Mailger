// src\index.js
const { app, BrowserWindow, ipcMain, dialog} = require('electron');

const path = require('node:path');
const url = require('url');
let mainWindow;

const pageHandler = require('./utils/pageHandler');
const {checkAuth} = require("./utils/auth");
async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'pages/preload.js'),
    },
    autoHideMenuBar: true,
  });
  pageHandler.init(mainWindow);
  pageHandler.initHandle(mainWindow);
  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  await checkAuth((auth) => {
    if (auth) mainWindow.loadFile(path.join(__dirname, 'pages/main.html'));
    else mainWindow.loadFile(path.join(__dirname, 'pages/welcome.html'));
  });
}

app.on('ready', createWindow);

ipcMain.on("alert", (event, title, message) => {
  const options = {
    type: "error",
    buttons: ["Okay"],
    title: title,
    message: message
  }
  dialog.showMessageBox(mainWindow, options)
  console.log('Error: ' + message);
})

/*
TODO: Система авторизации
TODO: Сохранение и проверка учетных данных

 */