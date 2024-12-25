const express = require('express');
const {check_existing_customer, name_update, email_generate_otp,email_otp_verification, mobile_generate_otp, mobile_otp_verification} = require('../controllers/CustomerDashboardController');
const router = express.Router();

const { validateRequest } = require("../config/validate-request");
const Joi = require("joi");

const namekey = (req, res, next) => {
    const schema = Joi.object({
        Name: Joi.string().required()
    });
    validateRequest(req, res, next, schema);
}
router.get('/check-existing-customer', check_existing_customer); // Create a user
router.put('/name-update', namekey, name_update); // Create a user

router.post('/email-update-otp', email_generate_otp); // Create a user
router.post('/email-update-verification', email_otp_verification); // Create a user

router.post('/mobile-update-otp', mobile_generate_otp); // Create a user
router.post('/mobile-update-verification', mobile_otp_verification); // Create a user
module.exports = router;
