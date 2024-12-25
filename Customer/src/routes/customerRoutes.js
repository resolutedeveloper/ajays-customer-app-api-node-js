const express = require('express');
const router = express.Router();

const {createCustomer, loginCustomer} = require('../controllers/customerController');
const customerVersionHandler = require('../controllers/CustomerVersionController');
const checKValidity = require('../middelware/CustomerTokenVerification');

router.post('/' , createCustomer);
router.get('/' , loginCustomer);
router.post("/version",checKValidity, customerVersionHandler)




module.exports = router;