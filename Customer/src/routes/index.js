const express = require("express");
const route = express.Router();
const CustomerToken = require("../middelware/CustomerTokenVerification.js");

route.use("/companys", require("./companyRoutes.js"));
route.use("/auth", require("./CustomerAuthRoutes.js"));
route.use("/customer",CustomerToken, require("./CustomerDashBoardRoutes.js"));
route.use("/favoriteLocation",CustomerToken, require("./favoriteLocationRoutes.js"));
route.use("/customers", require("./customerRoutes.js"));
route.use("/customefcm",CustomerToken, require("./CustomerFcmRoutes.js"))
route.use("/customeVersion",CustomerToken, require("./CustomerValidationRouter.js"))
route.use("/customerHistory",CustomerToken, require("./historyCustomerRoutes.js"))

route.use('/app-version', require('./AppversionMaintananceRouter')); // currently not use


//const GetProduct = require('../controllers/HttpsGetProduct.js');
const validateHTTP = require("../middelware/httpRequest.js");
route.use("/Get-htpp",validateHTTP, require("./HttpsRoutes"));



route.use('/Upload', require('./FileuploadRouter'));

module.exports = route;