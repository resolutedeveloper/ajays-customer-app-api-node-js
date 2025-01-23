const express = require('express');
const router = express.Router();

const { saveFCMKey, sendCustomerNotification } = require('../controllers/CustomerFcmController');
const httpRequest = require("../middelware/httpRequest");
// const { validateRequest } = require('../config/validate-request');
// const Joi = require('joi');



router.post("/save-fcm", saveFCMKey);
router.post("/send-notification", httpRequest, sendCustomerNotification);




module.exports = router;