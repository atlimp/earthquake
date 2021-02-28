const redis = require('redis');
const { promisify } = require('util');
require('dotenv').config();

const {
    REDIS_URL,
    REDIS_EXPIRE,
} = process.env;


const prefix = "quake_";


async function getCached(key) {
    const client = redis.createClient({ url: REDIS_URL });
    
    const getAsync = promisify(client.get).bind(client);
    
    const cached = await getAsync(prefix + key).catch((err) => {
        console.error(err);
        throw new Error(err);
      });

    client.quit();

    return JSON.parse(cached);
}

async function setCached(key, data) {
    const client = redis.createClient({ url: REDIS_URL });
    
    const setAsync = promisify(client.set).bind(client);

    await setAsync(prefix + key, JSON.stringify(data), 'EX', Number(REDIS_EXPIRE)).catch((err) => {
        console.error(err);
        throw new Error(err);
      });

    client.quit();
}

module.exports = {
    getCached,
    setCached,
}