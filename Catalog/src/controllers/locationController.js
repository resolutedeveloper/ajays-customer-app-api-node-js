const db = require('../models');  // Import the db object from index.js
const location = db.location;  // Get the location model from the db object
const logger = require("../utils/logger");
const { Op } = require('sequelize');


const createLocation = async (req, res) => {
    try {
        const input = req.body;
        
        const newData = await location.create(input);
        logger.info("Location created: ", JSON.stringify(newData));

        res.status(201).json(newData);  
    } catch (err) {
        logger.error(`Error creating location: ${err}`);
        
        res.status(500).json({
            success: false,
            message: 'Error creating location',
            error: err.message
        });
    }
};



const getLocation = async (req, res) => {
    try {
      const { LocationID } = req.params;
      const locations = await location.findAll({
        where: {
          LocationID: LocationID,
        },
      });
  
      if (locations.length === 0) {
        return res.status(404).json({
          success: false,
          message: `No location found with LocationID: ${LocationID}`,
        });
      }
  
      res.status(200).json({
        success: true,
        data: locations,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Error fetching location",
        error: err.message || err,
      });
    }
  };


  const getAllLocation = async (req, res) => {
    try {

      const locations = await location.findAll({ });
  
      if (locations.length === 0) {
        return res.status(404).json({
          success: false,
          message: `No location found `,
        });
      }
  
      res.status(200).json({
        success: true,
        data: locations,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Error fetching location",
        error: err.message || err,
      });
    }
  };





  const searchLocations = async (req, res) => {
    try {
      const {
        LocationID,
        LocationName,
        CityId,
        CountryID,
        LocationSName,
        page,
        size,
      } = req.body;

      const limit = size ? parseInt(size, 5) : 5;
      const offset = page ? (parseInt(page, 10) - 1) * limit : 0;

      const whereUse = {};

      if (!LocationID &&!LocationName &&!CityId &&!CountryID &&!LocationSName) {
        return res.status(400).json({
          success: false,
          message: "At least one search criteria must be provided",
        });
      }

      if (LocationID) {
        whereUse.LocationID = LocationID;
      }

      if (LocationName) {
        if (LocationName.trim().length === 0) {
          return res.status(400).json({
            success: false,
            message: "LocationName cannot be empty",
          });
        }
        if (LocationName.trim().includes(" ")) {
          whereUse.LocationName = LocationName.trim();
        } else {
          whereUse.LocationName = { [Op.like]: `${LocationName}%` };
        }
      }

      if (CityId) {
        if (CityId.trim().length === 0) {
          return res.status(400).json({
            success: false,
            message: "CityId cannot be empty",
          });
        }
        if (CityId.trim().includes(" ")) {
          whereUse.CityId = CityId.trim();
        } else {
          whereUse.CityId = { [Op.like]: `${CityId}%` };
        }
      }

      if (CountryID) {
        if (CountryID.trim().length === 0) {
          return res.status(400).json({
            success: false,
            message: "CountryID cannot be empty",
          });
        }
        if (CountryID.trim().includes(" ")) {
          whereUse.CountryID = CountryID.trim();
        } else {
          whereUse.CountryID = { [Op.like]: `${CountryID}%` };
        }
      }

      if (LocationSName) {
        if (LocationSName.trim().length === 0) {
          return res.status(400).json({
            success: false,
            message: "LocationSName cannot be empty",
          });
        }
        if (LocationSName.trim().length === 4) { 
          whereUse.LocationSName = LocationSName.trim();
        } else {
          whereUse.LocationSName = { [Op.like]: `${LocationSName.trim()}%` };
        }
      }

      const { count, rows: locations } = await location.findAndCountAll({
        where: whereUse,
        limit,
        offset,
      });

      if (locations.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "No locations found" });
      }
      // Response with pagination metadata
      res.status(200).json({
        success: "Location Search Successfully",
        meta: {
          totalRecords: count,
          totalPages: Math.ceil(count / limit),
          currentPage: page ? parseInt(page, 10) : 1,
          pageLimit: limit,
        },
        data: locations,
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Error searching locations",
        error: err.message,
      });
    }
  };

  


module.exports = { createLocation, getLocation, searchLocations ,getAllLocation };
