const express = require("express");
const route = express.Router();
const httpVerify = require('../middleware/httpRequest.js'); // Http check middleware

route.use("/locations", require("./locationRoutes.js"));
route.use("/httpResponse",httpVerify, require("./httpResponseRoutes.js"));

module.exports = route;
