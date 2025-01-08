const express = require("express");
const route = express.Router();


const VerifyToken = require("../middelware/TokenVerification.js");

route.use("/order", VerifyToken, require("./OrderRoutes.js"));

module.exports = route;