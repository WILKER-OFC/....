const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');

// @desc    Actualizar API Key
// @route   PATCH /api/update-key
exports.updateApiKey = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.apiKey = uuidv4();
    await user.save();

    res.status(200).json({
      success: true,
      data: `Nueva API Key generada: ${user.apiKey}`
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Obtener Top de usuarios (Leaderboard)
// @route   GET /api/leaderboard
exports.getLeaderboard = async (req, res) => {
  try {
    const users = await User.find()
      .select('email usageCount')
      .sort({ usageCount: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Obtener tiempo de actividad (Uptime)
// @route   GET /api/uptime
exports.getUptime = (req, res) => {
  const uptime = process.uptime();
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);

  res.status(200).json({
    success: true,
    data: {
      uptime: `${hours}h ${minutes}m ${seconds}s`,
      message: 'Api Gohan está en línea y funcionando correctamente.'
    }
  });
};

// @desc    Obtener una frase de Gohan
// @route   GET /api/quote
exports.getQuote = (req, res) => {
  const quotes = [
    "¡No permitiré que sigas lastimando a los demás!",
    "¡Yo soy el hijo de Goku!",
    "El poder surge de una necesidad, no de un deseo.",
    "Si no puedo proteger a mi familia y amigos, ¿qué clase de guerrero soy?",
    "¡Debo volverme más fuerte!"
  ];
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  res.status(200).json({
    success: true,
    data: randomQuote
  });
};

// @desc    Obtener un dato curioso de Gohan
// @route   GET /api/gohan-fact
exports.getGohanFact = (req, res) => {
  const facts = [
    "Gohan fue el primero en alcanzar el Super Saiyan 2.",
    "A diferencia de su padre, Gohan prefiere los estudios a la lucha.",
    "El nombre 'Gohan' significa 'arroz' en japonés.",
    "Gohan es un talentoso investigador académico.",
    "Entrenó con Piccolo, quien se convirtió en su mentor y mejor amigo."
  ];
  const randomFact = facts[Math.floor(Math.random() * facts.length)];

  res.status(200).json({
    success: true,
    data: randomFact
  });
};
