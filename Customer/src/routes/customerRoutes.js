const express = require('express');
const { getCustomer, deleteCustomerAccount } = require('../controllers/customerController');
const router = express.Router();


router.get("/:customerId", getCustomer);
router.delete("/:customerId", deleteCustomerAccount);



module.exports = router;