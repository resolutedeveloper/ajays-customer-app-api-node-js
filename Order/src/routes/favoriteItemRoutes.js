const express = require('express');
const { addFavorite, getFavorites, removeFavorite } = require('../controllers/favoriteItemController');
const router = express.Router();

router.post("/",addFavorite);
router.get("/get",getFavorites);
router.delete("/remove",removeFavorite);



module.exports = router;