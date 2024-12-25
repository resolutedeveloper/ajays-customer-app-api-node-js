const express = require('express');
const { itemlist, locationDetail, citystores} = require('../controllers/httpResponseController');

const router = express.Router();

// router.post("/creates", createLocation);
// router.get("/gets/:LocationID", getLocation);
// router.get("/", getAllLocation);

// router.get("/search",searchLocations);

router.get("/itemlist/:ItemID", itemlist);
router.get("/location-detail/:LocationID", locationDetail);
router.get("/city-stores", citystores);


module.exports = router;
