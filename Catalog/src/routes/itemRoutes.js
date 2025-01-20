const express = require('express');
const { getItemDetails, getCatalogData, saveImage } = require('../controllers/itemController');
const validateCatalogToken = require('../middleware/TokenVerification');
const router = express.Router();


router.get("/:itemID", getItemDetails);
router.get("/", validateCatalogToken, getCatalogData);
router.put("/images",saveImage);



module.exports = router;