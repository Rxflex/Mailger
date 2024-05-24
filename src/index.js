// main.js

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const url = require('url');
let Datastore = require('nedb')
    , db = new Datastore({ filename: 'database.mg', autoload: true });

let mainWindow;

// Функция для создания главного окна приложения
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'pages/welcome.html'),
    protocol: 'file:',
    slashes: true
  }));

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

// Обработчик события "app ready"
app.on('ready', createWindow);

/*
TODO: Система авторизации
TODO: Сохранение и проверка учетных данных

 */