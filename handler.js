import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import config from './config.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const pluginsDir = path.join(__dirname, 'plugins')
let plugins = {}

export async function loadPlugins() {
    const files = fs.readdirSync(pluginsDir)
    for (const file of files) {
        if (file.endsWith('.js')) {
            const module = await import(`./plugins/${file}`)
            plugins[file] = module.default
        }
    }
}

export async function messageHandler(client, m) {
    if (!m.message) return
    const body = m.message.conversation || m.message.extendedTextMessage?.text || ''
    const prefix = config.prefix
    const isCmd = body.startsWith(prefix)
    const command = isCmd ? body.slice(prefix.length).trim().split(' ')[0].toLowerCase() : ''
    const args = body.trim().split(' ').slice(1)
    const sender = m.key.remoteJid
    const from = m.key.remoteJid

    // Simple reply function
    const reply = (text) => {
        client.sendMessage(from, { text }, { quoted: m })
    }

    // Load plugins dynamically if they are not loaded
    if (Object.keys(plugins).length === 0) {
        await loadPlugins()
    }

    for (const file in plugins) {
        const plugin = plugins[file]
        if (plugin.command && (Array.isArray(plugin.command) ? plugin.command.includes(command) : plugin.command === command)) {
            try {
                await plugin.exec({ client, m, args, reply, config })
            } catch (e) {
                console.error('Error executing plugin:', e)
                reply(`Hubo un error al ejecutar el comando ${command}`)
            }
        }
    }
}
