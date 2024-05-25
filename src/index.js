// src\index.js
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const url = require('url');
let mainWindow;

const pageHandler = require('./utils/pageHandler');

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    autoHideMenuBar: true,
  });

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'pages/welcome.html'),
    protocol: 'file:',
    slashes: true
  }));

  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  pageHandler.init(mainWindow);
}

app.on('ready', createWindow);

/*
TODO: Система авторизации
TODO: Сохранение и проверка учетных данных

 */