const simpleParser = require('mailparser').simpleParser;
module.exports = async (mainWindow, ipcMain, event,  ...args) => {
    return await simpleParser(args[0])
}