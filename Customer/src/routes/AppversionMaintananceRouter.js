const AppVersionController = require("../controllers/AppVersionController");
const router = require("express").Router();
///const passport = require("passport");

const { validateRequest } = require("../config/validate-request");
const Joi = require("joi");

const VehicleRegAdd = (req, res, next) => {
    const schema = Joi.object({
        Version: Joi.string().max(20).required()
    });
    validateRequest(req, res, next, schema);
}

router.post("/", VehicleRegAdd, AppVersionController.appversioncheck); //currently not used
router.post("/version_maintanance", VehicleRegAdd, AppVersionController.version_maintanance);
router.post("/version_maintanance_operator", VehicleRegAdd, AppVersionController.version_maintanance_operator);


module.exports = router;
