const express = require("express");
const route = express.Router();
const CustomerToken = require("../middelware/CustomerTokenVerification.js");

route.use("/companys", require("./companyRoutes.js"));
route.use("/auth", require("./CustomerAuthRoutes.js"));
route.use("/customer",CustomerToken, require("./CustomerDashBoardRoutes.js"));
route.use("/favoriteLocation", require("./favoriteLocationRoutes.js"));
route.use("/customers", require("./customerRoutes.js"));
route.use("/customefcm", require("./CustomerFcmRoutes.js"))

module.exports = route;