const express = require('express');
const {getItemDetails } = require('../controllers/itemController');
const router = express.Router();


router.get("/:itemID",getItemDetails);



module.exports = router;