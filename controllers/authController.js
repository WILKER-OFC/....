const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { readData, writeData } = require('../utils/db');
const { sendEmail } = require('../utils/mailer');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    console.warn('ADVERTENCIA: JWT_SECRET no está definido en las variables de entorno. Usando una clave insegura por defecto.');
}
const SECRET = JWT_SECRET || 'gohan_insecure_default_key';

const register = async (req, res) => {
    try {
        const { email, password, username } = req.body;
        const data = await readData();

        if (data.users.find(u => u.email === email)) {
            return res.status(400).json({ status: false, message: 'El correo ya está registrado.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const apiKey = crypto.randomBytes(16).toString('hex');
        const verificationToken = crypto.randomBytes(32).toString('hex');

        const newUser = {
            id: Date.now(),
            username,
            email,
            password: hashedPassword,
            apiKey,
            verified: false,
            verificationToken,
            usage: 0,
            createdAt: new Date().toISOString()
        };

        data.users.push(newUser);
        await writeData(data);

        const verificationLink = `https://${req.get('host')}/auth/verify?token=${verificationToken}`;
        await sendEmail(email, 'Verifica tu cuenta - Api Gohan', `Hola ${username}, verifica tu cuenta aquí: ${verificationLink}`);

        res.json({ status: true, message: 'Registro exitoso. Revisa tu Gmail para verificar tu cuenta.' });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;
        if (!token) return res.status(400).send('<h1>Token de verificación faltante.</h1>');

        const data = await readData();
        const user = data.users.find(u => u.verificationToken && u.verificationToken === token);

        if (!user) {
            return res.status(400).send('<h1>Token inválido o expirado.</h1>');
        }

        user.verified = true;
        user.verificationToken = null;
        await writeData(data);

        res.send('<h1>Cuenta verificada exitosamente. Ya puedes iniciar sesión.</h1>');
    } catch (error) {
        res.status(500).send(`<h1>Error interno: ${error.message}</h1>`);
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const data = await readData();
        const user = data.users.find(u => u.email === email);

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ status: false, message: 'Credenciales inválidas.' });
        }

        if (!user.verified) {
            return res.status(401).json({ status: false, message: 'Por favor, verifica tu correo primero.' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '1d' });
        res.json({ status: true, token, apiKey: user.apiKey, username: user.username });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const data = await readData();
        const user = data.users.find(u => u.email === email);

        if (!user) {
            return res.status(404).json({ status: false, message: 'Usuario no encontrado.' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetToken = resetToken;
        await writeData(data);

        const resetLink = `https://${req.get('host')}/reset-password.html?token=${resetToken}`;
        await sendEmail(email, 'Recuperar Contraseña - Api Gohan', `Hola, recupera tu contraseña aquí: ${resetLink}`);

        res.json({ status: true, message: 'Se ha enviado un correo para restablecer tu contraseña.' });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        if (!token) return res.status(400).json({ status: false, message: 'Token de recuperación faltante.' });

        const data = await readData();
        const user = data.users.find(u => u.resetToken && u.resetToken === token);

        if (!user) {
            return res.status(400).json({ status: false, message: 'Token inválido o expirado.' });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetToken = null;
        await writeData(data);

        res.json({ status: true, message: 'Contraseña actualizada correctamente.' });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

module.exports = { register, verifyEmail, login, forgotPassword, resetPassword };
