const express = require('express');
const { ItemDetail, LocationDetails, Storecitieslist, LatLongBaseLocation, LatLongBaseLocationCatitem} = require('../controllers/HttpsGetProduct.js');
const router = express.Router();
const { validateRequest } = require("../config/validate-request");
const Joi = require("joi");

router.get('/product-list/:ItemID', ItemDetail); // Create a user
router.get('/Location-list/:LocationID', LocationDetails); // Create a user
router.get('/Store-cities-list', Storecitieslist); // Create a user
router.get('/LatLongBase-Location', LatLongBaseLocation); // Create a user
router.get('/LatLongBase-Location-cat-item', LatLongBaseLocationCatitem); // Create a user

//router.post('/otp-verification', OTPverification); // Create a user
module.exports = router;
