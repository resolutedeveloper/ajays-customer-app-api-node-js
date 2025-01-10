const express = require('express');
const { getCustomer } = require('../controllers/customerController');
const router = express.Router();




router.get("/:customerId",getCustomer);




module.exports = router;