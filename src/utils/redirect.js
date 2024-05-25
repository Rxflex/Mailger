const url = require("url");
const path = require("node:path");
const logger = require("./logger");

module.exports = function (mainWindow, page) {
    logger.redirect('login');
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, `../pages/${page}.html`),
        protocol: 'file:',
        slashes: true
    }));
}