const express = require('express');
<<<<<<< HEAD
const { getItemDetails, getCatalogData, saveImage } = require('../controllers/itemController');
=======
const { getItemDetails, getCatalogData } = require('../controllers/itemController');

>>>>>>> cf59e4e18c3e5d73111f7a2a7b8197f41b177659
const validateCatalogToken = require('../middleware/TokenVerification');
const router = express.Router();


router.get("/:itemID", getItemDetails);
router.get("/", validateCatalogToken, getCatalogData);
router.put("/images",saveImage);



module.exports = router;