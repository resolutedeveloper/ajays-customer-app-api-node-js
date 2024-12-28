const express = require('express');
const router = express.Router();

const { saveFCMKey, sendCustomerNotification} = require('../controllers/CustomerFcmController');
// const { validateRequest } = require('../config/validate-request');
// const Joi = require('joi');



router.post("/save-fcm",saveFCMKey);
router.post("/send-notification",sendCustomerNotification);


module.exports = router;