const url = require("url");
const path = require("node:path");
const auth = require("../utils/auth");
const logger = require("../utils/logger");
module.exports = async function (mainWindow, event, ...args) {
    if (await auth.checkAuth()) {
        logger.redirect('dashboard');
        mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, '../pages/main.html'),
            protocol: 'file:',
            slashes: true
        }));
    } else {
        logger.redirect('login');
        mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, '../pages/login.html'),
            protocol: 'file:',
            slashes: true
        }));
}}