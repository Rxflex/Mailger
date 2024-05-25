const {showNotification, ipcMain} = require('../utils/notification.js')
const pjson = require('../../package.json');
module.exports = async function (mainWindow, event, ...args) {
    showNotification('Welcome to Mailger!', pjson.description);
}