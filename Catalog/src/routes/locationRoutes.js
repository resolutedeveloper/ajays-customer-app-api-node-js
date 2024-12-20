// locationRoutes.js

const express = require('express');
const { createLocation, getLocation, getLocationsLazy } = require('../controllers/locationController');

const router = express.Router();

router.post("/creates", createLocation);

router.get("/gets/:LocationID", getLocation);

module.exports = router;
