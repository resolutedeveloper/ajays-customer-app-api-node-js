const express = require('express');
const checKValidity = require('../middelware/CustomerTokenVerification');
const { saveFCMKey} = require('../controllers/CustomerFcmController');
const router = express.Router();


router.post("/save-fcm",checKValidity,saveFCMKey);


module.exports = router;