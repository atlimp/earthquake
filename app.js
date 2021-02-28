const express = require('express');
const { getEarthQuakeData, getCategories } = require('./scraper');
const cors = require('cors');


const app = express();

const {
    HOST: host = '127.0.0.1',
    PORT: port = 3000,
} = process.env;

app.use(cors());

app.get('/', (req, res) => {
    return res.json([
        '/earthquakes',
        '/areas'
    ]);
});

app.get('/earthquakes', async (req, res) => {
    const { area = '' } = req.query;

    if (!area)
        return res.status(400).json({ error: 'No area specified, find valid areas on /areas' });

    try {
        const result = await getEarthQuakeData(area);
        return res.json({
            count: result.length,
            data: result
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: 'Something went wrong' });
    }
    
});

app.get('/areas', async (req, res) => {
    try {
        const result = await getCategories();
        return res.json(result);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: 'Something went wrong' });
    }
});

app.listen(port, () => {
    console.log(`Server running on ${host}:${port}`);
});
