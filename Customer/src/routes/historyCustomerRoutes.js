const express = require('express');
const { historycustmoer } = require('../controllers/historyCustomerController');
const router = express.Router();


router.put('/history' , historycustmoer);

module.exports = router;