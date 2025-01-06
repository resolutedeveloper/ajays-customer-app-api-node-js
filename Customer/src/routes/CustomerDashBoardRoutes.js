const express = require('express');
const {check_existing_customer, name_update, email_generate_otp,email_otp_verification, mobile_generate_otp, mobile_otp_verification} = require('../controllers/CustomerDashboardController');
const router = express.Router();

const { validateRequest } = require("../config/validate-request");
const Joi = require("joi");

const namekey = (req, res, next) => {
    const schema = Joi.object({
        Name: Joi.string().required(),
        ProfileImage: Joi.string().required()
    });
    validateRequest(req, res, next, schema);
}

const emailkey = (req, res, next) => {
    const schema = Joi.object({
        EmailID: Joi.string().required()
    });
    validateRequest(req, res, next, schema);
}

const emailOTPValidation = (req, res, next) => {
    // Get OTP digits length from environment variable, default to 6 if not set
    const otpDigits = process.env.OTPDIGITS === '4' ? 4 : 6;

    const schema = Joi.object({
        // PhoneNumber: Joi.string()
        //     .pattern(/^[6789]\d{9}$/)
        //     .required()
        //     .messages({
        //         'string.pattern.base': 'Invalid mobile number format',
        //     }),
        EmailID: Joi.string().allow(''),
        OTP: Joi.string()
            .pattern(new RegExp(`^\\d{${otpDigits}}$`))
            .required()
            .messages({
                'string.pattern.base': `OTP must be exactly ${otpDigits} digits`,
            }),
    });

    validateRequest(req, res, next, schema);
};

const phoneNumberkey = (req, res, next) => {
    const schema = Joi.object({
        // PhoneNumber: Joi.string()
        //     .pattern(/^\d{10}$/) // Ensures exactly 10 digits
        //     .required()
        //     .messages({
        //         "string.pattern.base": "PhoneNumber must be a 10-digit number",
        //     }),
        PhoneNumber: Joi.string().allow(''),
    });
    validateRequest(req, res, next, schema);
}

const phoneOTPValidation = (req, res, next) => {
    // Get OTP digits length from environment variable, default to 6 if not set
    const otpDigits = process.env.OTPDIGITS === '4' ? 4 : 6;

    const schema = Joi.object({
        // PhoneNumber: Joi.string()
        // .pattern(/^\d{10}$/) // Ensures exactly 10 digits
        // .required()
        // .messages({
        //     "string.pattern.base": "PhoneNumber must be a 10-digit number",
        // }),
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




router.get('/check-existing-customer', check_existing_customer); // Create a user
router.put('/name-update', namekey, name_update); // Create a user

router.post('/email-update-otp',emailkey, email_generate_otp); // Create a user
router.post('/email-update-verification',emailOTPValidation, email_otp_verification); // Create a user

router.post('/mobile-update-otp',phoneNumberkey, mobile_generate_otp); // Create a user
router.post('/mobile-update-verification',phoneOTPValidation, mobile_otp_verification); // Create a user
module.exports = router;
