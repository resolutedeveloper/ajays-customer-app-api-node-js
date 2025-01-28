const express = require("express");
const route = express.Router();
const httpVerify = require('../middleware/httpRequest.js'); // Http check middleware
const checKValidity = require("../middleware/TokenVerification.js"); // Token verification
const { rateLimiter } = require("../services/rateLimiter.js") // Rate limiter 

route.use("/locations", require("./locationRoutes.js"));
route.use("/httpResponse", httpVerify, require("./httpResponseRoutes.js"));
route.use("/items", require("./itemRoutes.js"));
route.use("/item", checKValidity, require("./items.js"));
route.use("/cities", checKValidity, require("./cities.js"));
route.use("/location", checKValidity, require("./location.js"));
route.use("/dashboard", rateLimiter(15, 5), checKValidity, require("./dashboard.js"));

module.exports = route;
