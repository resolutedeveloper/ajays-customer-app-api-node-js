const express = require('express');
const router = express.Router();

const { saveFCMKey, sendCustomerNotification, sendCustomerNotificationHttp } = require('../controllers/CustomerFcmController');
const httpRequest = require("../middelware/httpRequestBearer");
// const { validateRequest } = require('../config/validate-request');
// const Joi = require('joi');



router.post("/save-fcm", saveFCMKey);
router.post("/send-notification", sendCustomerNotification);
router.post("/send-notification-http", httpRequest, sendCustomerNotificationHttp);



module.exports = router;