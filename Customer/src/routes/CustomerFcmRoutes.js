const express = require('express');
const checKValidity = require('../middelware/CustomerTokenVerification');
const { saveFCMKey, notifyCustomer } = require('../controllers/CustomerFcmController');
const router = express.Router();


router.post("/save-fcm",checKValidity,saveFCMKey);
router.post("/send-notification",checKValidity ,notifyCustomer);


module.exports = router;