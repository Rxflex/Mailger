const {showNotification} = require('../utils/notification.js')
const pjson = require('../../package.json');
const mails = require('../background/mails.js');
module.exports = async function (mainWindow, event, ...args) {
    showNotification('Welcome to Mailger!', pjson.description);

}