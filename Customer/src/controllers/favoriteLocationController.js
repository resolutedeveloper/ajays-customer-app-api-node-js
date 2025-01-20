const db = require('../models');
const favoriteLocation = db.favoriteLocation  // Import the db object from index.js
const logger = require("../utils/logger");
const moment = require('moment-timezone');
const axios = require('axios');

const createFavoriteLocation = async (req, res) => {
    try {
        // if (!Array.isArray(req.body.LocationID)) {
        //     throw new Error("Invalid input format. Expected an array of locations.");
        // }
        // // Extract the LocationIDs
        // const locationIds = req.body.LocationID.map(item => item.LocationID);
        // // Check for duplicates by comparing the length of the array with a Set (which removes duplicates)
        // const uniqueLocationIds = [...new Set(locationIds)];
        // // If the length of the array is different, it means there are duplicates
        // if (locationIds.length !== uniqueLocationIds.length) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "Duplicate LocationID found. Duplicate entries are not allowed.",
        //         data: null,
        //     });
        // }
        // // Create the locations array with unique LocationIDs
        // const locations = uniqueLocationIds.map(id => ({
        //     CustomerID: req.UserDetail.CustomerID,
        //     LocationID: id,
        // }));
        // // Insert records
        // const createLocations = await favoriteLocation.bulkCreate(locations);

        const FindLocation = await db.favoriteLocation.findOne({ where: { LocationID: req.body.LocationID, IsDeleted: 0 } });
        if (FindLocation) {
            return res.status(400).send({
                ErrorCode: "USEDID",
                ErrorMessage: "This location already used."
            });
        } else {
            const LocationAdd = await db.favoriteLocation.create({
                LocationID: req.body.LocationID,
                CustomerID: req.UserDetail.CustomerID,
                CreatedOn: moment().tz('Asia/Kolkata').toDate(), // Converts to IST
            });
            logger.info(`created: ${req.UserDetail.CustomerID}`);
            return res.status(200).json({
                message: "Locations added successfully.",
                data: LocationAdd,
            });
        }
    } catch (error) {
        logger.error(`Error creating user: ${error.message}`);
        return res.status(400).json({
            message: error.message
        });
    }

};

// const updateFavoriteLocation = async (req, res) => {
//     try {
//         if (!Array.isArray(req.body.LocationID)) {
//             throw new Error("Invalid input format. Expected an array of locations.");
//         }
//         await favoriteLocation.destroy({
//             where: { CustomerID: req.UserDetail.CustomerID, }, // Conditions to match the record
//         });
//         // Extract the LocationIDs
//         const locationIds = req.body.LocationID.map(item => item.LocationID);
//         // Check for duplicates by comparing the length of the array with a Set (which removes duplicates)
//         const uniqueLocationIds = [...new Set(locationIds)];
//         // If the length of the array is different, it means there are duplicates
//         if (locationIds.length !== uniqueLocationIds.length) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Duplicate LocationID found. Duplicate entries are not allowed.",
//                 data: null,
//             });
//         }
//         // Create the locations array with unique LocationIDs
//         const locations = uniqueLocationIds.map(id => ({
//             CustomerID: req.UserDetail.CustomerID,
//             LocationID: id,
//         }));
//         // Insert records
//         const createLocations = await favoriteLocation.bulkCreate(locations);
//         res.status(201).json({
//             success: true,
//             message: "Locations added successfully.",
//             data: createLocations,
//         });
//     } catch (error) {
//         res.status(400).json({
//             success: false,
//             message: error.message,
//             data: null,
//         });
//     }
// };

const deleteFavoriteLocation = async (req, res) => {
    try {
        const { UserDetail } = req;
        if (!UserDetail || !UserDetail?.CustomerID) {
            return res.status(400).send({
                ErrorCode: "LOCATION",
                ErrorMessage: "Invalid token! Login again"
            });
        }

        const { LocationID } = req.params;

        if (!LocationID) {
            return res.status(400).send({
                ErrorMessage: "Location id not found."
            });
        }

        const whereCondition = {};
        whereCondition["IsDeleted"] = 0;
        whereCondition["LocationID"] = LocationID;
        whereCondition["CustomerID"] = UserDetail.CustomerID;

        const FindData = await db.favoriteLocation.update({
            IsDeleted: 1
        }, {
            where: whereCondition,
        });

        if (FindData[0] == 0) {
            return res.status(400).send({
                "ErrorCode": "USEDID",
                "ErrorMessage": "This location does not exist."
            });
        }

        return res.status(200).json({
            message: "Location removed from favorites."
        })

    }
    catch (err) {
        return res.status(400).json({
            message: err.message
        })
    }
}

const viewAllFavoriteLocation = async (req, res) => {
    try {
        const { UserDetail } = req;
        if (!UserDetail || !UserDetail?.CustomerID) {
            return res.status(400).send({
                ErrorCode: "LOCATION",
                ErrorMessage: "Invalid token! Login again"
            });
        }

        const { latitude, longitude } = req.query;
        if (!latitude || !longitude) {
            return res.status(400).send({
                ErrorCode: "LOCATION",
                ErrorMessage: "Location is not enabled."
            });
        }
        // console.log(UserDetail?.CustomerID);
        const FindLocation = await db.favoriteLocation.findAll({ where: { CustomerID: req.UserDetail.CustomerID, IsDeleted: 0 } });
        if (!FindLocation) {
            return res.status(400).send({
                ErrorCode: "LOCATION",
                ErrorMessage: "This location is not exist."
            });
        } else {
            if (FindLocation.length > 0) {
                const idArr = FindLocation.map((locate) => locate?.LocationID);
                // console.log(idArr);
                const axiosData = await axios.post(`${process?.env?.CATALOG_LOCAL_URL}/httpResponse/locationBulkGetId`, {
                    allLocationsArr: JSON.stringify(idArr),
                    userLat: latitude,
                    userLong: longitude
                }, {
                    headers: { "Authorization": "Bearer " + process?.env?.HTTP_REQUEST_SECRET_KEY }
                });
                if (axiosData?.data?.locations) {
                    return res.status(200).json({
                        message: "view all favorite location successfully",
                        data: axiosData.data.locations
                    });
                }
            }
            return res.status(200).json({
                message: "view all favorite location successfully",
                data: FindLocation
            });
        }
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({
            message: err.message
        })
    }
}


const getFavoriteLocationById = async (req, res) => {
    try {
        const { id } = req.params;
        //const favoriteLocationData = await favoriteLocation.findByPk(id);
        const favoriteLocationData = await db.favoriteLocation.findAll({ where: { FavoriteLocationID: id, IsDeleted: 0 } });
        if (!favoriteLocationData) {
            return res.status(500).json({
                message: "Favorite location not found",
                data: null,
            });
        }
        res.status(200).json({
            message: "Favorite location by id retrieved successfully",
            data: favoriteLocationData,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Error retrieving favorite location",
            error: err.message,
        });
    }
};


module.exports = { createFavoriteLocation, deleteFavoriteLocation, viewAllFavoriteLocation, getFavoriteLocationById }