const express = require('express');
const router = express.Router();

const { saveFCMKey, sendCustomerNotification, sendCustomerNotificationHttp } = require('../controllers/CustomerFcmController');
const httpRequestBearer = require("../middelware/httpRequestBearer");
const checKValidity = require("../middelware/TokenVerification");
// const { validateRequest } = require('../config/validate-request');
// const Joi = require('joi');



router.post("/save-fcm", checKValidity, saveFCMKey);
router.post("/send-notification", checKValidity, sendCustomerNotification);
router.post("/send-notification-http", httpRequestBearer, sendCustomerNotificationHttp);



module.exports = router;