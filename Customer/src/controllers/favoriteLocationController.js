const db = require('../models');
const favoriteLocation = db.favoriteLocation  // Import the db object from index.js
const logger = require("../utils/logger");


const createFavoriteLocation = async (req, res) => {
    try {
        const currentTimeUTC = new Date();
        const currentTimeIST = new Date(currentTimeUTC.getTime() + (5.5 * 60 * 60 * 1000)); 

        const { CustomerID } = req.UserDetail;
        const { LocationID } = req.body;

        if (!CustomerID || !LocationID) {
            return res.status(400).json({
                success: false,
                message: "CustomerID and LocationID are required",
            });
        }

        const createLocation = await favoriteLocation.create({
            CustomerID,
            LocationID,
            CreatedOn: currentTimeIST,
        });

        logger.info("Favorite Location created: ", JSON.stringify(createLocation));

        res.status(200).json({
            success: true,
            message: "Favorite location created successfully",
            data: createLocation,
        });
    } catch (err) {
        logger.error("Error creating favorite location: ", err);
        res.status(400).json({
            success: false,
            data: null,
            message: err.message,
        });
    }
};



const updateFavoriteLocation = async (req, res) => {
    try {
        // Extracting FavoriteLocationID from the request parameters
        const { FavoriteLocationID } = req.params;

        // Validating FavoriteLocationID
        if (!FavoriteLocationID) {
            return res.status(400).json({
                success: false,
                message: 'FavoriteLocationID is required in the URL parameters.'
            });
        }

        // Extracting input data from the request body
        const input = req.body;

        // Updating the record in the database
        const [updatedCount] = await favoriteLocation.update(input, {
            where: { FavoriteLocationID },
        });

        // Checking if the record was found and updated
        if (updatedCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Favorite location not found or no changes were made.',
            });
        }

        // Fetching the updated record
        const updatedFavoriteLocation = await favoriteLocation.findByPk(FavoriteLocationID);

        // Sending the response with the updated record
        res.status(200).json({
            success: true,
            message: 'Favorite location updated successfully.',
            data: updatedFavoriteLocation
        });
    } catch (err) {
        // Handling errors
        res.status(400).json({
            success: false,
            message: err.message
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