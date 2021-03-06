require('isomorphic-fetch');
require('dotenv').config();
const cheerio = require('cheerio');
const { getCached, setCached } = require('./caching');

async function get(url) {
    try {
        const result = await fetch(url);

        if (result.status >= 200 && result.status < 300)
            return await result.text();
        
        return null;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

async function getEarthQuakeData(area) {
    const cached = await getCached(area);
    
    if (cached) {
        return cached;
    }
    
    baseUrl = process.env.BASE_URL_IS;
    
    let url = `${baseUrl}${area}`;
    
    if (area === 'all')
    url = baseUrl;
    
    const html = await get(url);
    
    if (html == null) return [];

    try {
        const arr = eval(html.match(/VI.quakeInfo = .*/g)[0].split(' = ')[1]);
        const mapped = arr.map((e) => {
            return {
                datetime: e.t,
                depth: Number(e.dep.replace(',', '.')),
                location: `${Number(e.dL.replace(',', '.'))} km ${e.dD} af ${e.dR}`,
                lat: Number(e.lat.replace(',', '.')),
                lon: Number(e.lon.replace(',', '.')),
                quality: Number(e.q.replace(',', '.')),
                magnitude: Number(e.s.replace(',', '.'))
            }
        });

        setCached(area, mapped);

        return mapped;
    } catch (e) {
        console.error(e);
        throw e;
    }    
}

async function getCategories() {
    const baseUrl = process.env.BASE_URL_IS;
    const html = await get(baseUrl);

    const $ = cheerio.load(html);

    const categories = [];

    const list = $('.level2 li').each((i, el) => {
        const a = $(el).find('a');
        const href = a.attr('href');
        const split = href.split('/');
        categories.push({
            name: a.text(),
            path: split[split.length - 2],
        });
    });

    return categories;
}

module.exports = {
    getEarthQuakeData,
    getCategories,
}