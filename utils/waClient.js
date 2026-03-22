const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');
const path = require('path');

let sock;
const authPath = path.join(__dirname, '../wa_auth');

const connectWA = async () => {
    const { state, saveCreds } = await useMultiFileAuthState(authPath);

    sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        logger: pino({ level: 'silent' })
    });

    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) connectWA();
        } else if (connection === 'open') {
            console.log('Conexión con WhatsApp abierta.');
        }
    });

    return sock;
};

const getSock = () => sock || connectWA();

module.exports = { getSock };
