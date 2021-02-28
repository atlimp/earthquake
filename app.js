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
        return res.status(400).json({ error: "No area specified" });

    const result = await getEarthQuakeData(area);
    return res.json(result);
});

app.get('/areas', async (req, res) => {
    const result = await getCategories();
    return res.json(result);
})



app.listen(port, () => {
    console.log(`Server running on ${host}:${port}`);
});
