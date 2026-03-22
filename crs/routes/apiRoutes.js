const express = require('express');
const {
  updateApiKey,
  getLeaderboard,
  getUptime,
  getQuote,
  getGohanFact
} = require('../controllers/apiController');
const { protect } = require('../middleware/auth');
const { apiKeyGuard } = require('../middleware/apiKey');

const router = express.Router();

// Rutas públicas (no requieren API Key ni Auth)
router.get('/uptime', getUptime);
router.get('/leaderboard', getLeaderboard);

// Rutas que requieren API Key
router.get('/quote', apiKeyGuard, getQuote);
router.get('/gohan-fact', apiKeyGuard, getGohanFact);

// Rutas que requieren Autenticación (JWT)
router.patch('/update-key', protect, updateApiKey);

module.exports = router;
