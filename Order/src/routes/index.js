const express = require("express");
const route = express.Router();


// Login Action Related Route
route.use("/users", require("./userRoutes.js"));
module.exports = route;