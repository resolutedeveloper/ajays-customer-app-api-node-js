const express = require("express");
const router = express.Router();

const { citystores } = require('../controllers/httpResponseController');

router.get("/cities-details", citystores);


module.exports = router;