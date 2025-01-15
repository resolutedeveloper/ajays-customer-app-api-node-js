const express = require("express");
const router = express.Router();

const { citystores } = require('../controllers/httpResponseController');
const { getCityOutletsById } = require("../controllers/location");

router.get("/cities-details", citystores);
router.get("/oulets-by-cityid", getCityOutletsById);


module.exports = router;