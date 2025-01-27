const express = require("express");
const route = express.Router();


const VerifyToken = require("../middelware/TokenVerification.js");

route.use("/order", VerifyToken, require("./OrderRoutes.js"));
route.use("/feedback", VerifyToken, require("./Feedback.js"));
route.use("/rating", VerifyToken, require("./Rating.js"));

module.exports = route;