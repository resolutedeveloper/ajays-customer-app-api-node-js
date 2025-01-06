const express = require('express');
const { rateApp, updateRating } = require('../controllers/ratingAppController');
const router = express.Router();

router.post("/",rateApp);
router.put("/change", updateRating);



module.exports = router;