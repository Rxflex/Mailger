const { ImapFlow } = require('imapflow');
const { db } = require('../libs/database');

let config = {};
const memory = {};

async function readConfig() {
    console.log('Reading config...');
    return new Promise((resolve, reject) => {
        db.findOne({ _id: 'credentials' }, (err, doc) => {
            if (err) {
                return reject(err);
            }
            if (doc) {
                config = {
                    host: doc.imap_server,
                    port: doc.imap_port,
                    login: doc.imap_login,
                    password: doc.imap_password
                };
                console.log('Config loaded:', config);
                resolve();
            } else {
                reject(new Error('No credentials found in database.'));
            }
        });
    });
}

async function login(host, port, login, password, callback) {
    const client = new ImapFlow({
        host,
        port,
        secure: true,
        auth: {
            user: login,
            pass: password
        }
    });

    try {
        await client.connect();
        memory.client = client;
        config.host = host;
        config.port = port;
        config.login = login;
        config.password = password;
        callback({ status: true });
    } catch (error) {
        callback({ status: false, error });
    }
}

async function auth() {
    if (!config.host) {
        await readConfig();
    }
    if (memory.client) {
        return memory.client;
    }
    console.log('Authenticating with config:', config);
    const client = new ImapFlow({
        host: config.host,
        port: config.port,
        secure: true,
        auth: {
            user: config.login,
            pass: config.password
        }
    });
    await client.connect();
    memory.client = client;
    return client;
}

async function getMails(mailbox) {
    let client;
    try {
        client = memory.client || await auth();
        let lock = await client.getMailboxLock(mailbox);
        let mails = [];
        try {
            for await (let message of client.fetch('1:*', { envelope: true })) {
                mails.push(message.envelope);
            }
        } finally {
            lock.release();
        }
        return mails;
    } catch (error) {
        console.error("Error fetching mails:", error);
        throw error;
    } finally {
        if (client && memory.client) {
            await client.logout();
            memory.client = null;
        }
    }
}

module.exports = {
    login,
    getMails
};
