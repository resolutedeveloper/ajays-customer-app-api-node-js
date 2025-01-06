const express = require('express');
const { addToCart,viewCart, waitingOrders, updateOrderStatus, clearCart } = require('../controllers/addToCartController');
const router = express.Router();

router.get("/add",addToCart);
router.delete("/clear",clearCart);

router.get("/", viewCart);
router.get("/waiting",  waitingOrders);
router.get("/accept",  updateOrderStatus);


module.exports = router;