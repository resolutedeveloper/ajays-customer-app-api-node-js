const redis = require("redis");
const COLOR = "\x1b[31m";
const RESET = "\x1b[0m";

const internalUrl = process.env.REDIS_URL_INTERNAL;
const portRedis = process.env.REDIS_PORT;

const client = redis.createClient({
    url: `redis://${internalUrl}:${portRedis}`
});

client.on("error", (err) => {
    console.error("Redis Client Error", err);
});

const redisConnection = async () => {
    try {
        await client.connect();
        await client.set("OrderPing", "Redis Order Pong", {
            NX: true,
        });
        const test_catlog = await client.get("CatlogPing");
        const test_customer = await client.get("CustomerPing");
        console.log(`${COLOR}${test_catlog} ~ ${test_customer}${RESET}`);
    } catch (error) {
        console.log(error);
    }
};

module.exports = { client, redisConnection };