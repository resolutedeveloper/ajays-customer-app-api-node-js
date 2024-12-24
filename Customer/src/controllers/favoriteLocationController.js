const db = require("../models");
const favoriteLocation = db.favoriteLocation; // Import the db object from index.js
const logger = require("../utils/logger");
const Joi = require("joi");
const axios = require("axios");

const createFavoriteLocation = async (req, res) => {
  try {
    // Define Joi validation schema
    const schema = Joi.object({
      CustomerID: Joi.string().guid({ version: "uuidv4" }).required().messages({
        "string.empty": "CustomerID cannot be empty",
        "any.required": "CustomerID is required",
        "string.guid": "CustomerID must be a valid UUID",
      }),

      LocationID: Joi.number().integer().strict().min(1).required().messages({
        "number.base": "LocationID must be a number",
        "number.integer": "LocationID must be an integer",
        "any.required": "LocationID is required",
        "number.min": "LocationID must be a positive integer",
        "number.strict":
          "LocationID must not be a string or a non-integer value",
      }),

      IsActive: Joi.boolean().optional().messages({
        "boolean.base": "IsActive must be a boolean",
      }),

      IsDeleted: Joi.boolean().optional().messages({
        "boolean.base": "IsDeleted must be a boolean",
      }),
    });

    // Validate the request body using Joi
    const { error } = schema.validate(req.body);

    // If validation fails, return an error response
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    // Destructure the data from the request body
    const { CustomerID, LocationID, IsActive, IsDeleted } = req.body;


    try {

      // Updated the URL to use LocationID from the request body dynamically
      const locationResponse = await axios.get(`http://localhost:302/api/v1/locations/gets/${LocationID}`);

      console.log("Location response from catalog:", locationResponse.data);

      // Check if the first item in the data array exists and has a valid LocationID
      if (!locationResponse.data || !locationResponse.data.LocationID) {
        return res.status(404).json({
            success: false,
            message: 'Location not found in catalog database.',
        });
    }
    } catch (err) {
      console.error("Error while fetching location from catalog:", err);
      return res.status(500).json({
        success: false,
        message: "Error checking location in catalog database.",
      });
    }

    let existingLocation = await favoriteLocation.findOne({
      where: {
        LocationID,
        IsDeleted: false, // Ensure the location is not marked as deleted
      },
    });

    console.log("Existing Location Check Result:", existingLocation);

    if (existingLocation) {
      // If location already exists
      return res.status(200).json({
        success: false,
        message: "Location already exists in favorites.",
      });
    }

    let newLocation = await favoriteLocation.create({
      CustomerID,
      LocationID,
      CreatedOn: new Date(),
      IsActive: IsActive !== undefined ? IsActive : true, // Default to true if not provided
      IsDeleted: IsDeleted !== undefined ? IsDeleted : false, // Default to false if not provided
    });

    // Log the created favorite location
    logger.info("Favorite Location created: ", JSON.stringify(newLocation));

    // Return the success response after the location is created
    return res.status(201).json({
      success: true,
      message: "Favorite Location created successfully",
      data: newLocation,
    });
  } catch (err) {
    console.error("Error during favorite location creation: ", err);

    // Ensure that we don't send a response multiple times
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        data: null,
        message: err.message,
      });
    }
  }
};

const updateFavoriteLocation = async (req, res) => {
  // Define the Joi validation schema
  const schema = Joi.object({
    FavoriteLocationID: Joi.string().required().messages({
      "string.base": "FavoriteLocationID should be a string.",
      "string.empty": "FavoriteLocationID cannot be empty.",
      "any.required": "FavoriteLocationID is required.",
    }),
    LocationID: Joi.number().integer().strict().required().messages({
      "number.base": "LocationID must be a number.",
      "number.integer": "LocationID must be an integer.",
      // 'any.required': 'LocationID is required.',
      "number.strict": "LocationID must not be a string.",
    }),
  });

  try {
    // Validate the incoming data
    const { error, value } = schema.validate(req.body);

    // If validation fails, return a response with error details
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { FavoriteLocationID, LocationID } = value; // Use validated data

    // Update the record using Sequelize's update method
    const result = await favoriteLocation.update(value, {
      where: { FavoriteLocationID },
    });

    // Fetch the updated favorite location
    const updatedFavoriteLocation = await favoriteLocation.findByPk(
      FavoriteLocationID
    );

    // Return the success response
    res.status(200).json({
      success: true,
      message: "Favorite location updated successfully",
      data: updatedFavoriteLocation,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const deleteFavoriteLocation = async (req, res) => {
  // Define the Joi validation schema for the id parameter
  const schema = Joi.object({
    id: Joi.string().required().messages({
      "string.base": "id should be a string.",
      "string.empty": "id cannot be empty.",
      "any.required": "id is required.",
    }),
  });

  try {
    // Validate the incoming params
    const { error, value } = schema.validate(req.params);

    // If validation fails, return a response with error details
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { id } = value; // Use validated data

    // Check if the record exists
    const existingRecord = await favoriteLocation.findByPk(id);
    if (!existingRecord) {
      return res.status(404).json({
        success: false,
        message: "Favorite location not found.",
      });
    }

    // Delete the record
    await favoriteLocation.destroy({ where: { FavoriteLocationID: id } });

    // Return the success response with deleted record data
    res.status(200).json({
      success: true,
      message: "Favorite location deleted successfully",
      data: existingRecord,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const viewAllFavoriteLocation = async (req, res) => {
  try {
    const locations = await favoriteLocation.findAll({
      where: {
        isDeleted: false,
      },
    });

    if (locations.length === 0) {
      return res.status(404).json({ message: "No favorite locations found" });
    }

    res.status(200).json({
      success: true,
      message: "view all favorite location successfully",
      data: locations,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      data: null,
      message: err.message,
    });
  }
};

const getFavoriteLocationById = async (req, res) => {
  try {
    // Define Joi schema for the 'id' parameter
    const schema = Joi.object({
      id: Joi.string().required().messages({
        "string.base": "FavoriteLocationID should be a string.",
        "string.empty": "FavoriteLocationID cannot be empty.",
        "any.required": "FavoriteLocationID is required.",
      }),
    });

    // Validate the request params
    const { error } = schema.validate(req.params);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
        data: null,
      });
    }

    const { id } = req.params;

    // Retrieve the favorite location by ID
    const favoriteLocationData = await favoriteLocation.findByPk(id);

    // Check if the location was found
    if (!favoriteLocationData) {
      return res.status(404).json({
        success: false,
        message: "Favorite location not found",
        data: null,
      });
    }

    // Return the favorite location data
    res.status(200).json({
      success: true,
      message: "Favorite location by id retrieved successfully",
      data: favoriteLocationData,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error retrieving favorite location",
      error: err.message,
    });
  }
};

module.exports = {
  createFavoriteLocation,
  updateFavoriteLocation,
  deleteFavoriteLocation,
  viewAllFavoriteLocation,
  getFavoriteLocationById,
};
