// main.js

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const url = require('url');
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

// Проверка, авторизован ли пользователь
ipcMain.on('check-authentication', (event, isAuthenticated) => {
  if (!isAuthenticated) {
    // Если пользователь не авторизован, показываем страницу приветствия
    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'welcome.html'),
      protocol: 'file:',
      slashes: true
    }));
  }
});

ipcMain.on('open-login-page', () => {
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'login.html'),
    protocol: 'file:',
    slashes: true
  }));
});

// Остальные обработчики событий...
