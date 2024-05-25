const redirect = require("../utils/redirect");
module.exports = async function (mainWindow, event, ...args) {
    redirect(mainWindow, 'login');
}