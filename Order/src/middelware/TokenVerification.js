const jwt = require('jsonwebtoken');
const { db } = require('../models/index');
const { client } = require('../cache/redis'); // Redis client ko import karna
require('dotenv').config();
const moment = require('moment-timezone');
async function checKValidity(req, res, next) {
    try {
        if (!req.headers.authorization) {
            return res.status(404).json({
                message: "Token not found"
            });
        }

        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return res.status(404).json({
                message: "Oops! There was an error while authentication! Login Again"
            });
        }

        const verified = await jwt.verify(token, 'AjaysToken');
        if (!verified) {
            return res.status(404).json({
                message: "Invalid token"
            });
        }

        // Decode the token to check expiry time
        const decoded = await jwt.decode(token);
        if (!decoded) {
            return res.status(404).json({
                message: "Invalid token"
            });
        }


        var currentTime = new Date(moment.tz(new Date(), "Asia/Kolkata").format('YYYY-MM-DD HH:mm:ss'));
        var currentTime = currentTime.getTime() / 1000; // Divide by 1000 to get seconds
        if (decoded.exp < currentTime) {
            await client.del("userauth:" + decoded.CustomerID);
            return res.status(401).json({
                message: "Token has expired",
                expiredTokenData: decoded // Send the expired token data
            });
        }

        const user_status = await client.get("userauth:" + decoded.CustomerID);
        if (user_status) {
            return res.status(400).json({
                account_status: "Inactive",
                message: "Your account is unauthorized. Please contact the administrator for further assistance."
            });
        }
        req.body.CustomerID = decoded.CustomerID;
        req.UserDetail = verified;

        next();
    } catch (error) {
        return res.status(500).json({
            message: "Sorry! There was a server-side error",
            error: error
        });
    }
}


module.exports = checKValidity;