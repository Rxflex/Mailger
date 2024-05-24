const Imap = require('imap');
const { simpleParser } = require('mailparser');

const imapConfig = {
    user: 'your-email@example.com',
    password: 'your-password',
    host: 'imap.example.com',
    port: 993,
    tls: true
};

const getEmails = () => {
    const imap = new Imap(imapConfig);

    imap.once('ready', () => {
        imap.openBox('INBOX', true, (err, box) => {
            if (err) throw err;

            const fetchOptions = {
                bodies: '',
                markSeen: false
            };

            imap.search(['UNSEEN', ['SINCE', new Date()]], (err, results) => {
                if (err) throw err;
                if (!results || !results.length) {
                    console.log('No unread emails');
                    imap.end();
                    return;
                }

                const f = imap.fetch(results, fetchOptions);

                f.on('message', (msg, seqno) => {
                    msg.on('body', (stream, info) => {
                        simpleParser(stream, async (err, parsed) => {
                            if (err) throw err;
                            console.log(`Subject: ${parsed.subject}`);
                            console.log(`From: ${parsed.from.text}`);
                            console.log(`Body: ${parsed.text}`);
                        });
                    });

                    msg.once('attributes', attrs => {
                        const { uid } = attrs;
                        imap.addFlags(uid, ['\\Seen'], err => {
                            if (err) console.log(err);
                            else console.log(`Marked email ${uid} as read`);
                        });
                    });
                });

                f.once('error', ex => {
                    console.log('Fetch error: ' + ex);
                });

                f.once('end', () => {
                    console.log('Done fetching all messages!');
                    imap.end();
                });
            });
        });
    });

    imap.once('error', err => {
        console.log(err);
    });

    imap.once('end', () => {
        console.log('Connection ended');
    });

    imap.connect();
};

getEmails();
