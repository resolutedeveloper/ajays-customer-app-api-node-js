const express = require("express");
const route = express.Router();

route.use("/favoriteLocation", require("./favoriteLocationRoutes"));
route.use("/customers", require("./customerRoutes"));

module.exports = route;