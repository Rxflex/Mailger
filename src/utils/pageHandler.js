const fs = require('fs');
const path = require('path');
const { ipcMain } = require('electron');


async function init(mainWindow) {
    const directoryPath = path.join(__dirname, '../pages-handler');
    try {
        const files = await fs.promises.readdir(directoryPath);
            for (const file of files) {
                const filePath = path.join(directoryPath, file);
                const stat = await fs.promises.stat(filePath);
                if (stat.isFile()) {
                    const filename = file.replace('.js', '');
                    console.log(`Page handler: ${filename}`);
                    ipcMain.on(filename, (event, ...args) => {
                        require('../pages-handler/' + file)(mainWindow, event,args);
                    });
                }}
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    init
}