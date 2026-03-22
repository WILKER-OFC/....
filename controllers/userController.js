const crypto = require('crypto');
const { readData, writeData } = require('../utils/db');

const rotateApiKey = async (req, res) => {
    try {
        const userId = req.user.id;
        const data = await readData();
        const user = data.users.find(u => u.id === userId);

        if (!user) {
            return res.status(404).json({ status: false, message: 'Usuario no encontrado.' });
        }

        const newApiKey = crypto.randomBytes(16).toString('hex');
        user.apiKey = newApiKey;
        await writeData(data);

        res.json({ status: true, message: 'API Key actualizada correctamente.', apiKey: newApiKey });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const data = await readData();
        const user = data.users.find(u => u.id === userId);

        if (!user) {
            return res.status(404).json({ status: false, message: 'Usuario no encontrado.' });
        }

        const { password, verificationToken, resetToken, ...userProfile } = user;
        res.json({ status: true, profile: userProfile });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

module.exports = { rotateApiKey, getProfile };
