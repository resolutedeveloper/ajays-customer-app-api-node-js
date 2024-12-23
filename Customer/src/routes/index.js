const express = require("express");
const route = express.Router();

route.use("/favoriteLocation", require("./favoriteLocationRoutes"));

module.exports = route;