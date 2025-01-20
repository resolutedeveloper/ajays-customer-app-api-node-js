const express = require("express");
const router = express.Router();

const { itemlist } = require('../controllers/httpResponseController');

router.get("/item-details/:ItemID", itemlist);


module.exports = router;