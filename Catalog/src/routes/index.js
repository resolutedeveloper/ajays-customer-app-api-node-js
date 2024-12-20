const express = require("express");
const route = express.Router();

route.use("/locations", require("./locationRoutes.js"));

module.exports = route;
