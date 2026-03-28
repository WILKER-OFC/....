export default {
    name: 'menu',
    command: ['menu', 'help', 'comandos'],
    category: 'info',
    description: 'Muestra el menú de comandos',
    exec: async ({ client, m, reply, config }) => {
        const text = `
╭───「 *${config.botname}* 」───╮
│
│ *INFO*
│ ➣ .menu
│ ➣ .ping
│ ➣ .help
│
│ *INFO BOT*
│ ➣ Prefix: [ ${config.prefix} ]
│ ➣ Owner: Bardot
│
╰───────────────────────────╯
`
        reply(text)
    }
}
