const express = require("express");
const route = express.Router();

const { startPayment, paymentResponseHandler } = require("../controllers/CustomerPayment");

route.post("/pay", startPayment);
route.post("/payment-response", paymentResponseHandler);

module.exports = route;