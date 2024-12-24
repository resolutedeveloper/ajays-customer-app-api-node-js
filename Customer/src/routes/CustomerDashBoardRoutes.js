const express = require('express');
const {check_existing_customer, name_update} = require('../controllers/CustomerDashboardController');
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
module.exports = router;
