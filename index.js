import { spawn } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function start() {
    let args = [path.join(__dirname, 'main.js'), ...process.argv.slice(2)]
    let p = spawn(process.argv[0], args, {
        stdio: ['inherit', 'inherit', 'inherit', 'ipc']
    })

    p.on('message', data => {
        if (data === 'reset') {
            console.log('Reiniciando Bot...')
            p.kill()
            start()
        }
    })

    p.on('exit', code => {
        console.error('Salió con el código:', code)
        if (code !== 0) start()
    })
}

start()
