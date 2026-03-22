const { readData, writeData } = require('../utils/db');

const apiKeyMiddleware = async (req, res, next) => {
    try {
        const { apikey } = req.query;

        if (!apikey) {
            return res.status(401).json({ status: false, message: 'Falta la API Key en los parámetros.' });
        }

        const data = await readData();
        const user = data.users.find(u => u.apiKey === apikey);

        if (!user) {
            return res.status(401).json({ status: false, message: 'API Key inválida.' });
        }

        if (!user.verified) {
            return res.status(401).json({ status: false, message: 'La cuenta asociada a esta API Key no está verificada.' });
        }

        // Incrementar uso
        user.usage = (user.usage || 0) + 1;
        await writeData(data);

        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ status: false, message: 'Error de servidor en validación de API Key.' });
    }
};

module.exports = apiKeyMiddleware;
