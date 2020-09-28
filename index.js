const redis = require('async-redis');

const client = redis.createClient({
    host: 'wy2x'
});

client.on('error', console.error);

// default expire = 10 seconds
async function rateLimit(key = '127.0.0.1', limit = 10, expire = 10) {
    // Set the rate limit key
    const keyName = `RL:${key}`;

    // Get the key from the redis instance
    const count = await client.get(keyName);
    
    // Log for visuals
    console.log(keyName)
    
    // If the count exceeds the limit, rate limit
    if (count > limit) {
        return true;
    }

    // If no count, increment and set expire
    if (!count) {
        await client.multi().incr(keyName).expire(keyName, expire).exec();
    }

    // If there is a count that does not exceed the limit, increment
    if (count) {
        await client.incr(keyName);
    }

    return false;
}

async function main() {
    setInterval(async () => console.log(await rateLimit()), 500);

    // console.log(await rateLimit('127.0.0.1'));

    // process.exit(1);
}

main();