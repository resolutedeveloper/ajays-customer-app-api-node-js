const express = require('express');
const { addToCart,viewCart, waitingOrders, updateOrderStatus } = require('../controllers/addToCartController');
const router = express.Router();

router.get("/add",addToCart);

router.get("/", viewCart);
router.get("/waiting",  waitingOrders);
router.get("/accept",  updateOrderStatus);


module.exports = router;