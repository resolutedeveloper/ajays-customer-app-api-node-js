
const express = require("express");
const route = express.Router();

route.use("/companys", require("./companyRoutes.js"));

module.exports = route;