import {
    makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore
} from '@whiskeysockets/baileys'
import pino from 'pino'
import { Boom } from '@hapi/boom'
import fs from 'fs'
import qrcode from 'qrcode-terminal'
import readline from 'readline'
import config from './config.js'
import { messageHandler } from './handler.js'

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (text) => new Promise((resolve) => rl.question(text, resolve))

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState(config.session_name)
    const { version, isLatest } = await fetchLatestBaileysVersion()

    const client = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: !config.pairing_code,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })),
        },
        browser: ["Ubuntu", "Chrome", "20.0.04"]
    })

    if (config.pairing_code && !client.authState.creds.registered) {
        let phoneNumber = await question('Por favor ingrese su número de WhatsApp (ej: 5491122334455): ')
        phoneNumber = phoneNumber.replace(/[^0-9]/g, '')
        if (!phoneNumber || phoneNumber.length < 8) {
            console.log("Número inválido. Use el formato internacional.")
            process.exit(0)
        }
        setTimeout(async () => {
            let code = await client.requestPairingCode(phoneNumber)
            code = code?.match(/.{1,4}/g)?.join("-") || code
            console.log(`TU CÓDIGO DE EMPAREJAMIENTO ES: ${code}`)
        }, 3000)
    }

    client.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update
        if (qr && !config.pairing_code) {
            qrcode.generate(qr, { small: true })
        }
        if (connection === 'close') {
            let reason = new Boom(lastDisconnect?.error)?.output.statusCode
            if (reason === DisconnectReason.loggedOut) {
                console.log('Sesión cerrada, elimine la carpeta de sesión y escanee de nuevo.')
                process.exit()
            } else {
                startBot()
            }
        } else if (connection === 'open') {
            console.log('--- CONECTADO EXITOSAMENTE ---')
            console.log(`Bot Name: ${config.botname}`)
        }
    })

    client.ev.on('creds.update', saveCreds)

    client.ev.on('messages.upsert', async (chatUpdate) => {
        try {
            const m = chatUpdate.messages[0]
            if (!m.message) return
            await messageHandler(client, m)
        } catch (err) {
            console.error(err)
        }
    })

    return client
}

startBot()
