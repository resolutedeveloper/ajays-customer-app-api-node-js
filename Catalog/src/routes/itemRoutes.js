const express = require('express');
const {getItemDetails, getCatalogData } = require('../controllers/itemController');
const validateCatalogToken = require('../middleware/catalogTokenVerification');
const router = express.Router();


router.get("/:itemID",getItemDetails);
router.get("/", validateCatalogToken ,getCatalogData);



module.exports = router;