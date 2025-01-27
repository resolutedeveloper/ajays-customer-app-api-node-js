const express = require('express');
const router = express.Router();

const { submitFeedBack } = require("../controllers/FeedbackController");

router.post("/submit-feedback", submitFeedBack);

module.exports = router;