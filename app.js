const express = require('express');
const { getEarthQuakeData, getCategories } = require('./scraper');

const app = express();

const {
    HOST: host = '127.0.0.1',
    PORT: port = 3000,
} = process.env;

app.get('/', (req, res) => {
    return res.json([
        '/earthquakes',
        '/categories'
    ]);
});

app.get('/earthquakes', async (req, res) => {
    const { l = '', q = '' } = req.query;

    const result = await getEarthQuakeData(q, l);
    return res.json(result);
});

app.get('/categories', async (req, res) => {
    const { l } = req.query;

    const result = await getCategories(l);
    return res.json(result);
})



app.listen(port, () => {
    console.log(`Server running on ${host}:${port}`);
});