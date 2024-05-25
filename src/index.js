// src\index.js
const { app, BrowserWindow, ipcMain, dialog, ipcRenderer} = require('electron');

const path = require('node:path');
const url = require('url');
let mainWindow;

const pageHandler = require('./utils/pageHandler');
const {checkAuth} = require("./utils/auth");
const logger = require("./utils/logger");

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    autoHideMenuBar: true,
  });

  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  await checkAuth((auth)=>{
    if(auth) mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'pages/main.html'),
      protocol: 'file:',
      slashes: true
    }));
    else mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'pages/welcome.html'),
      protocol: 'file:',
      slashes: true
    }));
  })


  pageHandler.init(mainWindow);
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