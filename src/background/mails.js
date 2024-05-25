const imap = require("../libs/imap");
const {db} = require("../libs/database");
module.exports = function (interval) {
    return setInterval(async()=>{
        const mails = await imap.getMails('INBOX');
        const doc = {
            _id: 'inbox',
            mails: mails
        };
        db.insert(doc, (err) => {
            if (err) console.error(err)
            else log.info('Document inserted successfully');
        })
    }, interval)
}