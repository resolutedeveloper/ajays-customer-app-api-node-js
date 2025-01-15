const express = require('express');
const { itemlist, locationDetail, citystores, latlonglocation, latlonglocationItem, bulkfindLocationsHttp } = require('../controllers/httpResponseController');

const router = express.Router();

// Middlewares (if any)
const httpRequest = require("../middleware/httpRequest");
const checKValidity = require('../middleware/TokenVerification');


// router.post("/creates", createLocation);
// router.get("/gets/:LocationID", getLocation);
// router.get("/", getAllLocation);

// router.get("/search",searchLocations);

// router.get("/item-detail/:ItemID", itemlist);
router.get("/location-detail/:CityID", locationDetail);
// router.get("/city-stores", citystores);
router.get("/latlonglocation", latlonglocation);
router.get("/latlonglocationItem", latlonglocationItem);
router.post("/locationBulkGetId", httpRequest, bulkfindLocationsHttp);

module.exports = router;
