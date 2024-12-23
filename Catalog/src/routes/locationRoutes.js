// locationRoutes.js

const express = require('express');
const { createLocation, getLocation, searchLocations,getAllLocation } = require('../controllers/locationController');

const router = express.Router();

router.post("/creates", createLocation);

router.get("/gets/:LocationID", getLocation);
router.get("/", getAllLocation);
router.get("/search",searchLocations);

module.exports = router;
