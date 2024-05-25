// src\pages-handler\login.js
module.exports = function (mainWindow, ipcMain, event, ...args) {
    const inputs = JSON.parse(args[0][0].document);
    if (!inputs.imap_server || !inputs.imap_login || !inputs.imap_password || !inputs.smtp_server || !inputs.smtp_login || !inputs.smtp_password) return mainWindow.webContents.send('alert', 'You need to fill in all the fields!');


}
