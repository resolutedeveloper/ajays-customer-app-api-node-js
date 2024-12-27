const express = require("express");
const { createFavoriteLocation, updateFavoriteLocation, deleteFavoriteLocation, viewAllFavoriteLocation, getFavoriteLocationById } = require("../controllers/favoriteLocationController");
const Joi = require("joi");
const { validateRequest } = require("../config/validate-request");



const router = express.Router();

const locationKey = (req,res,next)=>{

    const schema = Joi.object({
        LocationID: Joi.number().integer().strict().min(1).required().messages({
          "number.base": "LocationID must be a number",
          "number.integer": "LocationID must be an integer",
          "any.required": "LocationID is required",
          "number.min": "LocationID must be a positive integer",
          "number.strict":
            "LocationID must not be a string or a non-integer value",
        }),
    
      });

      validateRequest(req, res, next, schema);
}

const getlocationKey = (req, res, next) => {
  const schema = Joi.object({
      FavoriteLocationID: Joi.string()
          .guid({ version: "uuidv4" })
          // .required()
          .messages({
              "string.empty": "FavoriteLocationID cannot be empty",
              "any.required": "FavoriteLocationID is required",
              "string.guid": "FavoriteLocationID must be a valid UUID",
          }),
  });

  validateRequest(req, res, next, schema, 'params');
};


router.post("/", createFavoriteLocation);
router.put("/:FavoriteLocationID",locationKey, updateFavoriteLocation);
router.delete("/:id",getlocationKey, deleteFavoriteLocation);
router.get("/", viewAllFavoriteLocation);
router.get("/:id",getlocationKey, getFavoriteLocationById);



module.exports = router;