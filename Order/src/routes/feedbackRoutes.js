const express = require('express');
const { submitFeedback } = require('../controllers/feedbackController');
const router = express.Router();

router.post("/",submitFeedback);
// router.put("/update", updateFeedback);



module.exports = router;