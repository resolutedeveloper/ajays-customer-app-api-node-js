const express = require('express');
const { createItem,getItemDetails } = require('../controllers/itemController');
const router = express.Router();


router.post("/",createItem);
router.get("/:itemID",getItemDetails);



module.exports = router;