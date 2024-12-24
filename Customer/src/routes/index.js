const express = require("express");
const route = express.Router();
const CustomerToken = require("../middelware/CustomerTokenVerification.js");

<<<<<<< HEAD
route.use("/companys", require("./companyRoutes.js"));
route.use("/auth", require("./CustomerAuthRoutes.js"));
route.use("/customer",CustomerToken, require("./CustomerDashBoardRoutes.js"));
=======
route.use("/favoriteLocation", require("./favoriteLocationRoutes"));
route.use("/customers", require("./customerRoutes"));
>>>>>>> 63acf3e332013307f93588c7fc589f66a8608a4b

module.exports = route;