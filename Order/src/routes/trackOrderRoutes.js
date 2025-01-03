const express = require('express');
const { orderList, orderDetails } = require('../controllers/trackOrderController');
const router = express.Router();


router.get("/",orderList);
router.get("/detail",orderDetails);

module.exports = router;