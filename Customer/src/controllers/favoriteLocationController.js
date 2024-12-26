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
            IsActive: true, // Set default value
            IsDeleted: false, // Set default value
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
        const { FavoriteLocationID } = req.body;
        const input = req.body;

        if (!FavoriteLocationID) {
            return res.status(500).json({
                success: false,
                message: 'FavoriteLocationID is required.'
            });
        }

        // Update the record using Sequelize's update method
        const result = await favoriteLocation.update(input, {
            where: { FavoriteLocationID },
        });


        const updatedFavoriteLocation = await favoriteLocation.findByPk(FavoriteLocationID);

        res.status(200).json({
            success: true,
            message: 'Favorite location updated successfully',
            data: updatedFavoriteLocation
        });
    } catch (err) {
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