const AppVersionController = require("../controllers/AppVersionController");
const router = require("express").Router();
///const passport = require("passport");

const { validateRequest } = require("../config/validate-request");
const Joi = require("joi");

const Maintanace = (req, res, next) => {
    const schema = Joi.object({
        Version: Joi.string().max(20).required()
    });
    validateRequest(req, res, next, schema);
}
router.post("/", Maintanace, AppVersionController.appversioncheck);
module.exports = router;
