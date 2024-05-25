const { ImapFlow } = require('imapflow');

const config = {};
const memory = {};

async function login(host, port, login, password, callback) {
    const client = new ImapFlow({
        host: host,
        port: port,
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

function auth() {
    this.config = config;
    if (memory.client) return memory.client;
    return new ImapFlow({
        host: this.config.host,
        port: this.config.port,
        secure: true,
        auth: {
            user: this.config.login,
            pass: this.config.password
        }
    });
}

async function getMails(mailbox) {
    let client = memory.client || auth();

    try {
        if (!memory.client) {
            await client.connect();
            memory.client = client;
        }

        let lock = await client.getMailboxLock(mailbox);
        try {
            const mails = await client.fetch('1:*', { envelope: true });
            return mails;
        } finally {
            await lock.release();
        }
    } catch (error) {
        console.error("Error fetching mails:", error);
        throw error;
    } finally {
        await client.logout();
        memory.client = null;
    }
}

module.exports = {
    login,
    getMails
};
