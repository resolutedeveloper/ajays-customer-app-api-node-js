const express = require('express');
const router = express.Router();

const {createCustomer, loginCustomer} = require('../controllers/customerController');
const checKValidity = require('../middelware/CustomerTokenVerification');

router.post('/' , createCustomer);
router.get('/' ,checKValidity, loginCustomer);




module.exports = router;