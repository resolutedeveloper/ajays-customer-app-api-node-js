const express = require("express");
const router = express.Router();

const { latlonglocation } = require('../controllers/httpResponseController');

router.get("/location-details", latlonglocation);


module.exports = router;