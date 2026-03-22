const axios = require('axios');
const cheerio = require('cheerio');

const nsfwSearch = async (query) => {
    try {
        const { data } = await axios.get(`https://www.eporner.com/search/${query}/`);
        const $ = cheerio.load(data);
        const results = [];
        $('.post-contents').each((i, el) => {
            const title = $(el).find('h3 a').text();
            const url = 'https://www.eporner.com' + $(el).find('h3 a').attr('href');
            const thumb = $(el).find('img').attr('src');
            results.push({ title, url, thumb });
        });
        return results;
    } catch (e) {
        return [];
    }
};

const pinterest = async (url) => {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const img = $('meta[property="og:image"]').attr('content');
        return { img };
    } catch (e) {
        return null;
    }
};

module.exports = { nsfwSearch, pinterest };
