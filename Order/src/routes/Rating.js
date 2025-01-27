const express = require('express');
const router = express.Router();

const { submitRating } = require("../controllers/RatingController");

router.post("/submit-rating", submitRating);

module.exports = router;