const jwt = require('jsonwebtoken');
require('dotenv').config();  // Load environment variables

async function tokenVerification(req, res, next) {
    try {
        if (!req.headers.authorization) {
            return res.status(404).json({
                message: "Token not found"
            });
        }

        const token = req.headers.authorization.split(" ")[1]; // Extract the token
        console.log("🚀 ~ tokenVerification ~ token:", token)
        if (!token) {
            return res.status(404).json({
                message: "Oops! There was an error while authentication! Login Again"
            });
        } else {
            try {
                // Load the secret key used in Customer server (it should be the same as used in signing the token)
                const secretKey = process.env.JWT_SECRET || "AjaysToken"; // Use the same key as in Customer server
                console.log("🚀 ~ tokenVerification ~ secretKey:", secretKey)

                const decoded = await jwt.verify(token, secretKey); // Verify the token using the same key

                console.log("🚀 ~ tokenVerification ~ Decoded Token:", decoded);
                req.UserDetail = decoded; // Attach decoded user data to the request

                next(); // Proceed with the request
            } catch (error) {
                console.error("JWT Verification Error:", error);
                if (error.name === 'TokenExpiredError') {
                    return res.status(401).json({
                        message: "Token expired, please login again."
                    });
                }
                return res.status(401).json({
                    message: "Invalid token",
                    error: error.message
                });
            }
        }
    } catch (error) {
        console.error("Error in tokenVerification middleware:", error);
        return res.status(500).json({
            message: "Server error occurred while verifying token"
        });
    }
}

module.exports = tokenVerification;
