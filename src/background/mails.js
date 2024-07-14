const imap = require("../libs/imap");
const { db } = require("../libs/database");

async function getMails() {
    try {
        // Wrap db.findOne into a promise
        const existingDoc = await new Promise((resolve, reject) => {
            db.findOne({ _id: 'inbox' }, (err, doc) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(doc);
                }
            });
        });

        // Check existence of document, and if it is a mail array
        const existingMails = (existingDoc && Array.isArray(existingDoc.mails)) ? existingDoc.mails : [];

        // Parse new mails from server
        const newMails = await imap.getMailsWithContent('INBOX');

        // Identify new mails by comparison of their ID with current data
        const uniqueNewMails = newMails.filter(mail => !existingMails.some(existingMail => existingMail.messageId === mail.messageId));

        // If any new mails, write them to DB and send new notification
        if (uniqueNewMails.length > 0) {
            const updatedMails = [...existingMails, ...uniqueNewMails];
            await new Promise((resolve, reject) => {
                db.update({ _id: 'inbox' }, { $set: { mails: updatedMails } }, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        console.info('New mails added:', uniqueNewMails);
                        console.info('Document updated successfully');
                        resolve();
                    }
                });
            });
        } else {
            console.info('No new mails found');
        }

        // return all mails
        return existingMails.concat(uniqueNewMails);
    } catch (error) {
        console.error('Error fetching or updating mails:', error);
        throw error;
    }
}

module.exports = { getMails };
