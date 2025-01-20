const express = require("express");
const router = express.Router();

const { DashboardData } = require("../controllers/dashboard");

router.get("/", DashboardData);

module.exports = router;