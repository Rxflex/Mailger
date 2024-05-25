const {showNotification} = require('../utils/notification.js')
const imap = require('../libs/imap');
const pjson = require('../../package.json');
module.exports = async function (mainWindow, event, ...args) {
    showNotification('Welcome to Mailger!', pjson.description);
    const mails = await imap.getMails(null, 'INBOX');
    console.log(await mails);
}