const db = require('../models');  // Import the db object from index.js
const location = db.location;  // Get the location model from the db object
const logger = require("../utils/logger");

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
            error: err.message || err
        });
    }
};



const getLocation = async (req, res) => {
    try {
        const { LocationID } = req.params;
        const locations = await location.findAll({
            where: {
                LocationID: LocationID
            }
        });

        if (locations.length === 0) {
            return res.status(404).json({
                success: false,
                message: `No location found with LocationID: ${LocationID}`
            });
        }

        res.status(200).json({
            success: true,
            data: locations
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error fetching location',
            error: err.message || err
        });
    }
};


const getLocationsLazy = async (req, res) => {
    try {
        const { offset = 0, limit = 20 } = req.query;

        const locations = await location.findAll({
            where: {},  // No specific filter, just get all locations
            offset: parseInt(offset),  // Starting point for records
            limit: parseInt(limit),    // Number of records to load at once
        });

        // Return found locations
        res.status(200).json({
            success: true,
            data: locations
        });
    } catch (err) {
        logger.error(`Error fetching locations: ${err}`);
        res.status(500).json({
            success: false,
            message: 'Error fetching locations',
            error: err.message || err
        });
    }
};


module.exports = {createLocation,getLocation, getLocationsLazy};