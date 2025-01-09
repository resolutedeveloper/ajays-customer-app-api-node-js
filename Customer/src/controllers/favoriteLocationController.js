const db = require('../models');
const favoriteLocation = db.favoriteLocation  // Import the db object from index.js
const logger = require("../utils/logger");


const createFavoriteLocation = async (req, res) => {
    try {
        if (!Array.isArray(req.body.LocationID)) {
            throw new Error("Invalid input format. Expected an array of locations.");
        }
    
        // Extract the LocationIDs
        const locationIds = req.body.LocationID.map(item => item.LocationID);
    
        // Check for duplicates by comparing the length of the array with a Set (which removes duplicates)
        const uniqueLocationIds = [...new Set(locationIds)];
    
        // If the length of the array is different, it means there are duplicates
        if (locationIds.length !== uniqueLocationIds.length) {
            return res.status(400).json({
                success: false,
                message: "Duplicate LocationID found. Duplicate entries are not allowed.",
                data: null,
            });
        }
    
        // Create the locations array with unique LocationIDs
        const locations = uniqueLocationIds.map(id => ({
            CustomerID: req.UserDetail.CustomerID,
            LocationID: id,
        }));
    
        // Insert records
        const createLocations = await favoriteLocation.bulkCreate(locations);
    
        res.status(201).json({
            success: true,
            message: "Locations added successfully.",
            data: createLocations,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
            data: null,
        });
    }
    
};



const updateFavoriteLocation = async (req, res) => {
    try {
        if (!Array.isArray(req.body.LocationID)) {
            throw new Error("Invalid input format. Expected an array of locations.");
        }

        await favoriteLocation.destroy({
            where: { CustomerID: req.UserDetail.CustomerID, }, // Conditions to match the record
        });
    
        // Extract the LocationIDs
        const locationIds = req.body.LocationID.map(item => item.LocationID);
    
        // Check for duplicates by comparing the length of the array with a Set (which removes duplicates)
        const uniqueLocationIds = [...new Set(locationIds)];
    
        // If the length of the array is different, it means there are duplicates
        if (locationIds.length !== uniqueLocationIds.length) {
            return res.status(400).json({
                success: false,
                message: "Duplicate LocationID found. Duplicate entries are not allowed.",
                data: null,
            });
        }
    
        // Create the locations array with unique LocationIDs
        const locations = uniqueLocationIds.map(id => ({
            CustomerID: req.UserDetail.CustomerID,
            LocationID: id,
        }));
    
        // Insert records
        const createLocations = await favoriteLocation.bulkCreate(locations);
    
        res.status(201).json({
            success: true,
            message: "Locations added successfully.",
            data: createLocations,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
            data: null,
        });
    }
};


const deleteFavoriteLocation = async (req,res)=>{
    try{
        const {id} = req.params;
        console.log("🚀 ~ id ~ req.params:", req.params)

        if (!id) {
            return res.status(500).json({
                success: false,
                message: 'id is required.'
            });
        }


        const existingRecord = await favoriteLocation.findByPk(id);

        const deleteLocation = await favoriteLocation.destroy({where: {FavoriteLocationID: id}});

        res.status(200).json({
            success:true,
            message:"delete favoriteLocation successfully",
            data: existingRecord
        })
    }
    catch(err){
        res.status(400).json({
            success: false,
            data: null,
            message: err.message
        })
    }
}


const viewAllFavoriteLocation = async (req,res)=>{
    try{
        const locations = await favoriteLocation.findAll({})

        res.status(200).json({
            success: true,
            message: "view all favorite location successfully",
            data: locations
        })
    }
    catch(err){
        res.status(400).json({
            success: false,
            data: null,
            message: err.message
        })
    }
}


const getFavoriteLocationById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("🚀 ~ getFavoriteLocationById ~ id:", id);

        const favoriteLocationData = await favoriteLocation.findByPk(id);

        if (!favoriteLocationData) {
            return res.status(500).json({
                success: false,
                message: "Favorite location not found",
                data: null,
            });
        }

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





module.exports = {createFavoriteLocation, updateFavoriteLocation, deleteFavoriteLocation, viewAllFavoriteLocation, getFavoriteLocationById}