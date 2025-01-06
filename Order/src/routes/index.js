const express = require("express");
const tokenVerification = require("../middleware/tokenVerification.js");
const route = express.Router();

route.use("/companys", require("./companyRoutes.js"));
route.use("/cart",tokenVerification, require("./addToCartRoutes.js"));
route.use("/track",tokenVerification, require("./trackOrderRoutes.js"));
route.use("/rating",tokenVerification, require("./ratingRoutes.js"));
route.use("/favoriteitem",tokenVerification, require("./favoriteItemRoutes.js"));
route.use("/rate-app",tokenVerification, require("./ratingAppRoutes.js"));
route.use("/feedback",tokenVerification, require("./feedbackRoutes.js"));

module.exports = route;