const express = require('express');
const { submitRating } = require('../controllers/ratingController');
const router = express.Router();

router.post("/add",submitRating);



module.exports = router;