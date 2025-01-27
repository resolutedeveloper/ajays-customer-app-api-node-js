const express = require('express');
const { getCustomer, getCustomerDetails } = require('../controllers/customerController');
const router = express.Router();




router.get("/:customerId",getCustomer);
router.get("/details/user", getCustomerDetails);


module.exports = router;