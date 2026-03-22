const User = require('../models/User');

const apiKeyGuard = async (req, res, next) => {
  const apikey = req.query.apikey || req.headers['x-api-key'];

  if (!apikey) {
    return res.status(401).json({ success: false, error: 'Por favor, proporciona una API Key válida' });
  }

  const user = await User.findOne({ apiKey: apikey });

  if (!user) {
    return res.status(401).json({ success: false, error: 'API Key inválida' });
  }

  // Incrementar conteo de uso
  user.usageCount += 1;
  await user.save();

  req.user = user;
  next();
};

module.exports = { apiKeyGuard };
