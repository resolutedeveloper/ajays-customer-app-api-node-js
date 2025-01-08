const express = require('express');
const router = express.Router();

const { AddOrder } = require('../controllers/OrderController');
// const { validateRequest } = require('../config/validate-request');
// const Joi = require('joi');



router.post("/", AddOrder);
// router.post("/send-notification", sendCustomerNotification);




module.exports = router;