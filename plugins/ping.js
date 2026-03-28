export default {
    name: 'ping',
    command: ['ping'],
    category: 'info',
    description: 'Verifica la latencia del bot',
    exec: async ({ client, m, reply }) => {
        const start = Date.now()
        await reply('Calculando latencia...')
        const end = Date.now()
        reply(`🏓 Pong! Latencia: ${end - start}ms`)
    }
}
