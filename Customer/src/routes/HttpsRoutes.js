const express = require('express');
const { ItemDetail, LocationDetails, Storecitieslist, LatLongBaseLocation, LatLongBaseLocationCatitem} = require('../controllers/HttpsGetProduct.js');
const router = express.Router();
const { validateRequest } = require("../config/validate-request");
const Joi = require("joi");
// const MobileNOValidation = (req, res, next) => {
//     const schema = Joi.object({
//         PhoneNumber: Joi.string().allow('')
//         // .pattern(/^[6789]\d{9}$/)
//         // .required()
//         // .messages({
//         //   'string.pattern.base': 'Invalid mobile number format',
//         // })
//     });
//     validateRequest(req, res, next, schema);
// }
router.get('/product-list/:ItemID', ItemDetail); // Create a user
router.get('/Location-list/:LocationID', LocationDetails); // Create a user
router.get('/Store-cities-list', Storecitieslist); // Create a user
router.get('/LatLongBase-Location', LatLongBaseLocation); // Create a user
router.get('/LatLongBase-Location-cat-item', LatLongBaseLocationCatitem); // Create a user

//router.post('/otp-verification', OTPverification); // Create a user
module.exports = router;
