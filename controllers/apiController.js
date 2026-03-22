const ytdl = require('@distube/ytdl-core');
const yts = require('yt-search');
const tiktok = require('@tobyg74/tiktok-api-dl');
const { getSock } = require('../utils/waClient');
const { readData } = require('../utils/db');
const { nsfwSearch, pinterest } = require('../utils/scrapers');

const startTime = Date.now();

const getUptime = (req, res) => {
    const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
    const hours = Math.floor(uptimeSeconds / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = uptimeSeconds % 60;

    res.json({
        status: true,
        uptime: `${hours}h ${minutes}m ${seconds}s`,
        timestamp: new Date().toISOString()
    });
};

const getLeaderboard = async (req, res) => {
    try {
        const data = await readData();
        const topUsers = data.users
            .sort((a, b) => (b.usage || 0) - (a.usage || 0))
            .slice(0, 10)
            .map(u => ({ username: u.username, usage: u.usage || 0 }));

        res.json({ status: true, leaderboard: topUsers });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

const searchYoutube = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.status(400).json({ status: false, message: 'Falta el parámetro de búsqueda (q).' });
        const results = await yts(q);
        res.json({ status: true, results: results.all.slice(0, 10) });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

const ytmp3 = async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.status(400).json({ status: false, message: 'Falta la URL.' });
        const info = await ytdl.getInfo(url);
        const format = ytdl.chooseFormat(info.formats, { quality: 'highestaudio', filter: 'audioonly' });
        res.json({ status: true, title: info.videoDetails.title, downloadUrl: format.url });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

const ytmp4 = async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.status(400).json({ status: false, message: 'Falta la URL.' });
        const info = await ytdl.getInfo(url);
        const format = ytdl.chooseFormat(info.formats, { quality: 'highest', filter: 'audioandvideo' });
        res.json({ status: true, title: info.videoDetails.title, downloadUrl: format.url });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

const tiktokDl = async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.status(400).json({ status: false, message: 'Falta la URL de TikTok.' });
        const result = await tiktok.Downloader(url, { version: 'v1' });
        res.json({ status: true, result });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

const checkBan = async (req, res) => {
    try {
        const { jid } = req.query;
        if (!jid) return res.status(400).json({ status: false, message: 'Falta el JID (ej: 57300...)' });
        const sock = await getSock();
        const [result] = await sock.onWhatsApp(jid);
        if (result && result.exists) {
            res.json({ status: true, message: 'El número está registrado en WhatsApp.', result });
        } else {
            res.json({ status: true, message: 'El número no está registrado o está en soporte.' });
        }
    } catch (error) {
        res.status(500).json({ status: false, message: 'Error al checar WhatsApp. Asegúrate de que el servidor esté vinculado.' });
    }
};

const reactCanal = async (req, res) => {
    try {
        const { jid, key, reaction } = req.query;
        if (!jid || !key) return res.status(400).json({ status: false, message: 'Faltan parámetros (jid, key).' });
        const sock = await getSock();
        await sock.sendMessage(jid, { react: { text: reaction || '🔥', key: JSON.parse(key) } });
        res.json({ status: true, message: 'Reacción enviada.' });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Error al enviar reacción.' });
    }
};

const nsfw = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.status(400).json({ status: false, message: 'Falta el parámetro de búsqueda (q).' });
        const results = await nsfwSearch(q);
        res.json({ status: true, results });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

const pinterestDl = async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.status(400).json({ status: false, message: 'Falta la URL de Pinterest.' });
        const result = await pinterest(url);
        res.json({ status: true, result });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

module.exports = { getUptime, getLeaderboard, searchYoutube, ytmp3, ytmp4, tiktokDl, checkBan, reactCanal, nsfw, pinterestDl };
