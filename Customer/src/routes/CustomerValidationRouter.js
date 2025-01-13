const express = require('express');
const router = express.Router();


const customerVersionHandler = require('../controllers/CustomerVersionController');
const { validateRequest } = require('../config/validate-request');
const Joi = require('joi');


const versionkey = (req, res, next) => {
    const schema = Joi.object({
        Version: Joi.string().required()
    });
    validateRequest(req, res, next, schema);
}

router.post("/version", versionkey, customerVersionHandler);



module.exports = router;