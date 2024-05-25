const imap = require("../libs/imap");
const { db } = require("../libs/database");

async function getMails() {
    try {
        // Оборачиваем db.findOne в промис
        const existingDoc = await new Promise((resolve, reject) => {
            db.findOne({ _id: 'inbox' }, (err, doc) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(doc);
                }
            });
        });

        // Проверяем, существует ли документ и является ли поле mails массивом
        const existingMails = (existingDoc && Array.isArray(existingDoc.mails)) ? existingDoc.mails : [];

        // Получаем новые письма с сервера
        const newMails = await imap.getMailsWithContent('INBOX');

        // Определяем новые письма путем сравнения их ID с текущими данными
        const uniqueNewMails = newMails.filter(mail => !existingMails.some(existingMail => existingMail.messageId === mail.messageId));

        // Если есть новые письма, записываем их в базу данных и отправляем уведомление
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

        // Возвращаем все письма
        return existingMails.concat(uniqueNewMails);
    } catch (error) {
        console.error('Error fetching or updating mails:', error);
        throw error;
    }
}

module.exports = { getMails };
