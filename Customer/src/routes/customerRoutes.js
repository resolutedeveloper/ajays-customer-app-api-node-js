const express = require('express');
const router = express.Router();

const {createCustomer, loginCustomer} = require('../controllers/customerController');

router.post('/' , createCustomer);
router.get('/' , loginCustomer);




module.exports = router;