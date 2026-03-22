const express = require('express');
const router = express.Router();
const { getUptime, getLeaderboard, searchYoutube, ytmp3, ytmp4, tiktokDl, checkBan, reactCanal, nsfw, pinterestDl } = require('../controllers/apiController');
const { rotateApiKey, getProfile } = require('../controllers/userController');
const apiKeyMiddleware = require('../middleware/apiKey');
const authMiddleware = require('../middleware/auth');

// Endpoints públicos con API Key
router.get('/uptime', getUptime);
router.get('/leaderboard', getLeaderboard);
router.get('/search', apiKeyMiddleware, searchYoutube);
router.get('/ytmp3', apiKeyMiddleware, ytmp3);
router.get('/ytmp4', apiKeyMiddleware, ytmp4);
router.get('/tiktok', apiKeyMiddleware, tiktokDl);
router.get('/checkban', apiKeyMiddleware, checkBan);
router.get('/reactcanal', apiKeyMiddleware, reactCanal);
router.get('/nsfw', apiKeyMiddleware, nsfw);
router.get('/pinterest', apiKeyMiddleware, pinterestDl);

// Endpoints de usuario protegidos por JWT
router.get('/profile', authMiddleware, getProfile);
router.post('/rotate-key', authMiddleware, rotateApiKey);

module.exports = router;
