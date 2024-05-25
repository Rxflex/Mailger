const mails = require("../background/mails");
const logger = require("../utils/logger");
module.exports = async function (event, ...args) {
    logger.log('Fetching mails...');
    return await mails.getMails();
}