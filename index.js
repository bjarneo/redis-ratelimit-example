const redis = require('redis');

const client = redis.createClient({
    host: 'wy2x'
});

client.on('error', console.error);

// default expire = 10 seconds
async function rateLimit(key = 'ip', limit = 100, expire = 10) {
    const setKey = (key) => `RL_${key}`;

    const keyName = setKey(key);

    const rl = await client.multi().incr(keyName).expire(keyName, expire).exec((err, res) => console.log(err, res));

    return rl;
}

async function main() {
    // setInterval(() => rateLimit(), 10000);

    await rateLimit('127.0.0.1');

    process.exit(1);
}

main();