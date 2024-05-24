const Imap = require('imap');
const { simpleParser } = require('mailparser');

const imapConfig = {};

// Функция для отправки данных формы
document.getElementById('saveButton').addEventListener('click', sendFormData);

function sendFormData() {
    const server = document.getElementById('serverInput').value;
    const login = document.getElementById('loginInput').value;
    const password = document.getElementById('passwordInput').value;

    imapConfig.host = server;
    imapConfig.user = login;
    imapConfig.password = password;
    // imapConfig.port = ;
    // imapConfig.tls = ;

    console.log('IMAP Config:', imapConfig);

    fetch('/imap', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(imapConfig),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });

    getEmails();
}

// Функция для получения писем
function getEmails() {
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
}
