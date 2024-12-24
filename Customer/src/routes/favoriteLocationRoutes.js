const express = require("express");
const { createFavoriteLocation, updateFavoriteLocation, deleteFavoriteLocation, viewAllFavoriteLocation, getFavoriteLocationById } = require("../controllers/favoriteLocationController");



const router = express.Router();

router.post("/", createFavoriteLocation);
router.put("/", updateFavoriteLocation);
router.delete("/:id", deleteFavoriteLocation);
router.get("/", viewAllFavoriteLocation);
router.get("/:id", getFavoriteLocationById);

module.exports = router;