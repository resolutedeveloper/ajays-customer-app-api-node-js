const express = require('express');
const { LocationDetails, LatLongBaseLocation, LatLongBaseLocationCatitem} = require('../controllers/HttpsGetProduct.js');
const router = express.Router();
const { validateRequest } = require("../config/validate-request");
const Joi = require("joi");

// router.get('/product-list/:ItemID', ItemDetail); 
router.get('/Location-list/:LocationID', LocationDetails); 
// router.get('/Store-cities-list', Storecitieslist); 
router.get('/LatLongBase-Location', LatLongBaseLocation); 
router.get('/LatLongBase-Location-cat-item', LatLongBaseLocationCatitem); 

//router.post('/otp-verification', OTPverification); 
module.exports = router;
