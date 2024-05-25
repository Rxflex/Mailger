const url = require("url");
const path = require("node:path");
const logger = require("./logger");

module.exports = function (mainWindow, page) {
    logger.redirect('login');
    mainWindow.loadFile(path.join(__dirname, `../pages/${page}.html`));
}