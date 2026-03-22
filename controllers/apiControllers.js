const ytdl = require('@distube/ytdl-core');
const yts = require('yt-search');
const { readData } = require('../utils/db');

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
        if (!url) return res.status(400).json({ status: false, message: 'Falta el parámetro de URL.' });

        const info = await ytdl.getInfo(url);
        const format = ytdl.chooseFormat(info.formats, { quality: 'highestaudio', filter: 'audioonly' });

        res.json({
            status: true,
            title: info.videoDetails.title,
            thumbnail: info.videoDetails.thumbnails[0].url,
            downloadUrl: format.url,
            duration: info.videoDetails.lengthSeconds
        });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

const ytmp4 = async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.status(400).json({ status: false, message: 'Falta el parámetro de URL.' });

        const info = await ytdl.getInfo(url);
        const format = ytdl.chooseFormat(info.formats, { quality: 'highest', filter: 'audioandvideo' });

        res.json({
            status: true,
            title: info.videoDetails.title,
            thumbnail: info.videoDetails.thumbnails[0].url,
            downloadUrl: format.url,
            duration: info.videoDetails.lengthSeconds
        });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

module.exports = { getUptime, getLeaderboard, searchYoutube, ytmp3, ytmp4 };
