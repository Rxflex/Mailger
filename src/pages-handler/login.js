// src\pages-handler\login.js
const imap = require('../libs/imap');
const {showNotification} = require('../utils/notification');
const redirect = require("../utils/redirect");
const {db} = require('../libs/database');
module.exports = function (mainWindow, ipcMain,event, ...args) {
    const inputs = JSON.parse(args[0][0].document);
    if (!inputs.imap_server || !inputs.imap_login || !inputs.imap_password || !inputs.smtp_server || !inputs.smtp_login || !inputs.smtp_password) return mainWindow.webContents.send('alert', 'Error!', 'You need to fill in all the fields!');
    imap.login(inputs.imap_server, 993, inputs.imap_login, inputs.imap_password, (status)=>{
        if(status.status) {
            const doc = {
                ...inputs,
                _id: 'credentials'
            }
            db.insert(doc, (err) => {
                if (err) console.error(err)
                else console.log('Document inserted successfully')
            })
            showNotification('Success', 'You successfully logged in. Redirecting...');
            redirect(mainWindow, 'main');
        } else {
            showNotification('Wrong credentials', 'Error, you provided wrong credentials!');
        }
    })
}
