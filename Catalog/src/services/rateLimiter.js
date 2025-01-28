const { client } = require("../cache/redis");
require("dotenv").config();

// Before importing this service here are some keys points to take in consideration 👇

//👉 Always follow the param pattern i.e limit first and time second
//👉 The maxLimit is the number of request it can get from an ip and maxTime is amount of time it is allowed to make in time range
//👉 maxTime should be in minutes
//👉 server restart can cause disruption in rate limit

function rateLimiter(maxLimit, maxTime) {
    return async (req, res, next) => {
        try {
            const { ip } = req;
            if (!ip) {
                return res.status(400).json({
                    message: "We are having trouble validating you!",
                    suggestion: "Disable any VPN or Proxy changers."
                })
            }
            const currentRequests = await client.incr(`RATE_LIMIT_${ip}`);

            if (currentRequests === 1) {
                await client.expire(`RATE_LIMIT_${ip}`, maxTime * 60);
            }

            if (currentRequests > maxLimit) {
                const timeLeft = await client.ttl(`RATE_LIMIT_${ip}`);
                return res.status(429).json({
                    message: "Too many requests. Please try again later.",
                    suggestion: timeLeft ? `Try after ${timeLeft} seconds` : `Slow down your request speed or try again later.`,
                });
            }

            next();
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "There was an error in rate-limiter.",
                suggestion: "Disable any VPN or Proxy changers or try again after some time"
            })
        }
    };
}

module.exports = { rateLimiter };