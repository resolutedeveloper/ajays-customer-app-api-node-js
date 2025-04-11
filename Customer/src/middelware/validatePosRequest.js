const Joi = require("joi");
require("dotenv").config();

async function validatePosRequest(req, res, next) {
    try {
        const token = req?.headers?.authorization;
        if (!token) {
            return res.status(401).json({
                message: "Validation failed",
                reason: "Not available"
            })
        }
        const tokenFetched = req.headers.authorization.split(" ")[1].trim();
        if (!tokenFetched || tokenFetched === "" || tokenFetched !== process.env.POS_TOKEN) {
            return res.status(401).json({
                message: "Validation failed",
                reason: "Mismatch"
            })
        }
        const schema = Joi.object({
            amount: Joi.number().positive().required(),
            orderId: Joi.number().positive().required(),
            billing_name: Joi.string().required(),
            billing_address: Joi.string().required(),
            billing_zipcode: Joi.string().pattern(/^[1-9][0-9]{5}$/).required(),
            billing_city: Joi.string().min(2).max(50).pattern(/^[a-zA-Z\s]+$/).required(),
            billing_state: Joi.string().min(2).max(50).pattern(/^[a-zA-Z\s]+$/).required(),
            billing_mobile: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
            billing_email: Joi.string().required()
        });

        const { error } = schema.validate(req?.body);
        if (error) {
            return res.status(400).json({
                status: 'false',
                message: 'Validation failed for req body',
                error: error
            });
        }
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'false',
            message: 'Sorry! There was a server-side error.',
            error: error
        });
    }
}

module.exports = { validatePosRequest };