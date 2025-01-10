const jwt = require('jsonwebtoken');
const axios = require('axios');
require('dotenv').config();

async function validateCatalogToken(req, res, next) {
    try {
        if (!req.headers.authorization) {
            return res.status(400).json({
                message: "Token not found"
            });
        }

        const token = req.headers.authorization.split(" ")[1];
        console.log("🚀 ~ validateCatalogToken ~ token:", token);

        if (!token) {
            return res.status(400).json({
                message: "Oops! There was an error while authentication! Login Again"
            });
        } else {
            try {

                const verified = await jwt.verify(token, 'AjaysToken');
                console.log("🚀 ~ validateCatalogToken ~ verified:", verified)

                const customerData = await axios.get(`${process.env.CUSTOMER_LOCAL_URL}customers/${verified.CustomerID}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const { IsActive, IsDeleted } = customerData.data;

                if (IsDeleted) {
                    return res.status(400).json({
                        account_status: "Acc_Deleted",
                        message: "Your account is deleted, please contact the admin."
                    });
                }

                if (!IsActive) {
                    return res.status(400).json({
                        account_status: "Acc_Deactive",
                        message: "Your account is deactivated, please contact the admin."
                    });
                }

                verified.Password = undefined;
                req.UserDetail = verified;
                req.token = token;
                next();

            } catch (error) {
                return res.status(400).json({
                    message: "Invalid token or error fetching customer data from catalog"
                });
            }
        }
    } catch (error) {
        return res.status(400).json({
            message: "Sorry! There was a server-side error"
        });
    }
}

module.exports = validateCatalogToken;
