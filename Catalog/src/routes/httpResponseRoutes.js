const express = require('express');
const { itemlist, locationDetail, citystores, latlonglocation, latlonglocationItem} = require('../controllers/httpResponseController');

const router = express.Router();

// router.post("/creates", createLocation);
// router.get("/gets/:LocationID", getLocation);
// router.get("/", getAllLocation);

// router.get("/search",searchLocations);

router.get("/item-detail/:ItemID", itemlist);
router.get("/location-detail/:CityID", locationDetail);
router.get("/city-stores", citystores);
router.get("/latlonglocation", latlonglocation);
router.get("/latlonglocationItem", latlonglocationItem);

module.exports = router;
