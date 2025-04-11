const express = require("express");
const route = express.Router();

const { startPayment, paymentResponseHandler, startPaymentPosMachine } = require("../controllers/CustomerPayment");

// middleware
const { validatePosRequest } = require("../middelware/validatePosRequest");

route.post("/pay", startPayment);
route.post("/pay-pos", validatePosRequest, startPaymentPosMachine);
route.post("/payment-response", paymentResponseHandler);

module.exports = route;