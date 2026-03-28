import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const config = {
    botname: 'Bardot Bot',
    owner: ['549XXXXXXXXX'], // Reemplaza con tu número
    prefix: '.',
    pairing_code: true, // Si quieres usar código de emparejamiento
    session_name: 'session',
    public: true,
}

export default config
