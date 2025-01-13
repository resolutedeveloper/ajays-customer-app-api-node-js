const express = require('express');
const { MobileNumberVerification, OTPverification } = require('../controllers/AuthCustomerController');
const router = express.Router();
const { validateRequest } = require("../config/validate-request");
const Joi = require("joi");

const MobileNOValidation = (req, res, next) => {
    const schema = Joi.object({
        PhoneNumber: Joi.string().allow('')
        // .pattern(/^[6789]\d{9}$/)
        // .required()
        // .messages({
        //   'string.pattern.base': 'Invalid mobile number format',
        // })
    });
    validateRequest(req, res, next, schema);
}

const OTPValidation = (req, res, next) => {
    // Get OTP digits length from environment variable, default to 6 if not set
    const otpDigits = process.env.OTPDIGITS === '4' ? 4 : 6;

    const schema = Joi.object({
        // PhoneNumber: Joi.string()
        //     .pattern(/^[6789]\d{9}$/)
        //     .required()
        //     .messages({
        //         'string.pattern.base': 'Invalid mobile number format',
        //     }),
        PhoneNumber: Joi.string().allow(''),
        OTP: Joi.string()
            .pattern(new RegExp(`^\\d{${otpDigits}}$`))
            .required()
            .messages({
                'string.pattern.base': `OTP must be exactly ${otpDigits} digits`,
            }),
    });

    validateRequest(req, res, next, schema);
};

router.post('/number-verification', MobileNOValidation, MobileNumberVerification); // Create a user
router.post('/otp-verification', OTPValidation, OTPverification); // Create a user

module.exports = router;
