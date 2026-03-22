const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'gohan_insecure_default_key';

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ status: false, message: 'Token de autenticación faltante.' });
    }

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ status: false, message: 'Token inválido o expirado.' });
    }
};

module.exports = authMiddleware;
