const express = require('express');
const { getCustomer, getCustomerDetails } = require('../controllers/customerController');
const router = express.Router();




router.get("/:customerId",getCustomer);
router.get("/details/", getCustomerDetails);


module.exports = router;