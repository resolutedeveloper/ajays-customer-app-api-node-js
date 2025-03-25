const { db } = require('../models');
const location = db.location;
const logger = require("../utils/logger");
const { Op, where, QueryTypes } = require('sequelize');
const axios = require('axios');
const { distanceCalculator, timeCalculator, getCityName } = require("../utils/distanceCalculator");
const moment = require("moment-timezone");

const itemlist = async (req, res) => {
    try {
        const { ItemID } = req.params;
        const itemlist = await db.item.findOne({
            where: {
                ItemID: ItemID,
            },
        });

        if (itemlist) {
            return res.status(200).json({
                message: 'product details found successfully',
                data: itemlist
            });
        } else {
            return res.status(400).send({
                ErrorCode: "VALIDATION",
                ErrorMessage: 'Product details not found'
            });
        }
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error fetching product",
            error: err.message || err,
        });
    }
};

//     try {
//       const { CityID } = req.params;
//       const location = await db.location.findOne({
//         where: {
//           Cityid: CityID,
//         },
//       });


//       if(location){
//         return res.status(200).json({
//             message: 'Location details found successfully',
//             data: location,
//         });
//         }else{
//             return res.status(400).send({
//                 ErrorCode: "VALIDATION", 
//                 ErrorMessage: 'Location details not found' 
//             });
//         }
//     } catch (err) {
//       res.status(500).json({
//         success: false,
//         message: "Error fetching Location",
//         error: err.message || err,
//       });
//     }
//   };

const locationDetail = async (req, res) => {
    try {
        const { CityID } = req.params;
        const { latitude, longitude } = req.query;

        // console.log("CityID received:", CityID);
        // console.log("Latitude and Longitude received:", latitude, longitude);

        // Validate input latitude and longitude
        if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
            return res.status(400).json({
                ErrorCode: "VALIDATION",
                ErrorMessage: "Invalid latitude or longitude provided",
            });
        }

        const lat1 = parseFloat(latitude);
        const lon1 = parseFloat(longitude);

        // Function to calculate distance using Haversine formula
        const calculateDistance = (lat1, lon1, lat2, lon2) => {
            const toRad = (value) => (value * Math.PI) / 180;
            const R = 6371; // Earth's radius in kilometers
            const dLat = toRad(lat2 - lat1);
            const dLon = toRad(lon2 - lon1);
            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c; // Distance in kilometers
        };

        // Function to estimate duration based on average speed
        const estimateDuration = (distance, speed = 40) => {
            // Default speed: 40 km/h (driving)
            return (distance / speed) * 60; // Duration in minutes
        };

        // Fetch location details
        const location = await db.location.findOne({
            where: {
                Cityid: CityID,
            },
        });

        if (location) {
            console.log("Location found:", location);

            const lat2 = parseFloat(location.Latitude);
            const lon2 = parseFloat(location.Longitude);

            // Calculate distance and duration
            const distance = calculateDistance(lat1, lon1, lat2, lon2);
            const duration = estimateDuration(distance);

            return res.status(200).json({
                message: 'Location details found successfully',
                data: {
                    ...location.dataValues,
                    Distance: `${distance.toFixed(2)} km`,
                    Duration: `${duration.toFixed(2)} minutes`,
                },
            });
        } else {
            console.log("No location found for CityID:", CityID);
            return res.status(400).send({
                ErrorCode: "VALIDATION",
                ErrorMessage: 'Location details not found',
            });
        }
    } catch (err) {
        console.error("Error fetching location:", err);
        res.status(500).json({
            success: false,
            message: "Error fetching Location",
            error: err.message || err,
        });
    }
};


const citystores = async (req, res) => {
    try {
        // const Cities = await db.sequelize.query(
        //     `SELECT DISTINCT c.*
        //      FROM Cities c
        //      INNER JOIN Locations l ON c.CityID = l.CityId
        //      ORDER BY c.CityName`,
        //     {
        //         type: db.Sequelize.QueryTypes.SELECT,
        //     }
        // );
        const Cities = await db.city.findAll({
            include: [{ model: db.location, attributes: ["Latitude", "Longitude", "LocationID"] }]
        });
        if (Cities) {
            return res.status(200).json({
                message: 'Cities details found successfully',
                data: Cities
            });
        } else {
            return res.status(400).send({
                ErrorCode: "VALIDATION",
                ErrorMessage: 'Cities details not found'
            });
        }
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error fetching Cities",
            error: err.message || err,
        });
    }
};


const latlonglocation = async (req, res) => {
    try {
        const { cityName, latitude, longitude } = req.query;

        if (!cityName || !latitude || !longitude) {
            return res.status(404).json({
                message: "City not found"
            })
        }
        const cityData = await db.city.findOne({
            where: {
                CityName: {
                    [Op.like]: cityName
                }
            }
        });

        const LatLongcityID = cityData?.dataValues?.CityID;

        if (!LatLongcityID) {
            return res.status(201).json({
                message: "Currently we are not serving in this location",
                status: 0,
                backendMessage: `City database is null. City was ${cityName}`
            })
        }

        const locations = await db.location.findAll({
            where: {
                Cityid: LatLongcityID,
            },
            include: [
                { model: db.LocationCompanyMapping, attributes: ['CompanyID'], }
            ],
            raw: true,
            nest: false
        });
        if (!locations || locations.length <= 0) {
            return res.status(201).json({
                message: "Currently we are not serving in this location",
                status: 0,
                backendMessage: `Location database is null. City was ${cityName}`
            })
        }

        // const results = locations.map((location) => {
        //     // const lat2 = parseFloat(location?.Latitude);
        //     // const lon2 = parseFloat(location?.Longitude);
        //     // const distance = distanceCalculator(latitude, longitude, lat2, lon2);
        //     // const duration = timeCalculator(distance, 40);

        //     return {
        //         ...location,
        //         Distance: `${distance.toFixed(2)} km`,
        //         Duration: `${duration.toFixed(2)} minutes`,
        //     };
        // });

        return res.status(200).json({
            message: 'Location details found successfully',
            data: locations,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Sorry! There was an server-side error",
            error: error
        })
    }

};


const latlonglocationItem = async (req, res) => {
    const axios = require('axios');
    const lat = req.query.latitude;
    const lon = req.query.longitude;
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
    async function fetchCityData() {
        try {
            const response = await axios.get(url);
            const stateDistrict = response.data?.address?.state_district;

            if (!stateDistrict) {
                throw new Error("State district not found in the response.");
            }

            const { Op } = require('sequelize');

            const cityData = await db.city.findOne({
                where: {
                    CityName: {
                        [Op.like]: stateDistrict
                    }
                }
            });
            const LatLongcityID = cityData.dataValues.CityID;

            const locations = await db.location.findOne({
                where: {
                    Cityid: LatLongcityID,
                },
            });

            const LocationWiseMap = await db.itemAllocation.findOne({
                where: {
                    LocationID: locations.dataValues.LocationID,
                },
            });

            const CategoryData = await db.category.findOne({
                where: {
                    CategoryID: LocationWiseMap.dataValues.CategoryID,
                },
            });

            const ItemData = await db.item.findOne({
                where: {
                    ItemID: LocationWiseMap.dataValues.ItemID,
                },
            });


            if (locations) {
                return res.status(200).json({
                    message: 'Location details found successfully',
                    data: [{ "Location": locations, "CategoryData": CategoryData, "ItemData": ItemData }]
                });
            } else {
                return res.status(400).send({
                    ErrorCode: "VALIDATION",
                    ErrorMessage: 'Location details not found'
                });
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    fetchCityData();
};



async function bulkfindLocationsHttp(req, res) {
    try {
        const { allLocationsArr, userLat, userLong } = req.body;
        if (!allLocationsArr || !userLat || !userLong) {
            return res.status(404).json({
                message: "No location was found"
            })
        }
        const parsedLocation = JSON.parse(allLocationsArr);

        const dataForReqLocations = await db.location.findAll({
            where: {
                LocationID: { [Op.in]: parsedLocation }
            },
            include: [
                { model: db.LocationCompanyMapping, attributes: ['CompanyID'], }
            ],
            raw: true,
            nest: false
        });

        if (dataForReqLocations && dataForReqLocations.length == 0) {
            return res.status(200).json({
                message: 'fetched success',
                locations: dataForReqLocations
            });
        }

        const dataWithDistance = dataForReqLocations.map((locationDb) => {
            const dist = distanceCalculator(userLat, userLong, locationDb.Latitude ? locationDb.Latitude : 0, locationDb.Longitude ? locationDb.Longitude : 0);
            const t = timeCalculator(dist, 40); // 40 km / hrs

            locationDb.Distance = `${dist} km`;
            locationDb.Duration = `${t} minutes`;
            return locationDb;
        })
        return res.status(200).json({
            message: 'fetched success',
            locations: dataWithDistance
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Sorry! There was an server-side error'
        });
    }
}


const checkoutItemsData = async (req, res) => {
    try {
        const itemJson = JSON.stringify(req.body.Items);
        const locationID = req.body.LocationID;
        const companyID = req.body.CompanyID;
        const currentISTTime = moment().tz("Asia/Kolkata").format("HH:mm:ss");

        const whereCondition = {};

        whereCondition["LocationID"] = locationID;
        whereCondition["IsLocationOnline"] = {
            [Op.eq]: 1
        };
        whereCondition[Op.and] = [
            {
                OutletOpeningTime: { [Op.lte]: currentISTTime }
            },
            {
                OutletClosingTime: { [Op.gte]: currentISTTime }
            }
        ];

        const checkLocationAvailability = await db.location.findOne({
            where: whereCondition
        });

        if (!checkLocationAvailability) {
            return res.status(400).json({
                message: "Location currently not available."
            })
        }

        // console.log(itemJson);

        const result = await db.sequelize.query(
            "CALL SP_ItemList(:ItemJson, :LocationID, :CompanyID)", {
            replacements: {
                ItemJson: itemJson,
                LocationID: locationID,
                CompanyID: companyID,
            },
            type: QueryTypes.SELECT,
            raw: false,
        }
        );

        const cleanedResult = result.map(item => Object.values(item));

        // console.log(result);
        // console.log(`%%%%%%%%%%%%%%%%%%%%%%`);
        // console.log(cleanedResult);

        return res.status(200).json({
            message: 'fetched success',
            data: cleanedResult
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error fetching product",
            error: err.message || err,
        });
    }
};

async function bulkFindItems(req, res) {
    try {
        const { itemIdArr } = req.body;
        if (!itemIdArr) {
            return res.status(400).json({
                message: "Items not found"
            })
        }
        // console.log(itemIdArr);
        // const parsedItemArr = JSON.parse(itemIdArr);
        const allItemsData = await db.item.findAll({
            where: { ItemID: { [Op.in]: itemIdArr } }
        })
        return res.status(200).json({
            message: 'Success',
            itemsData: allItemsData
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Sorry! There was an server-side error'
        });
    }
}

module.exports = { itemlist, locationDetail, citystores, latlonglocation, latlonglocationItem, bulkfindLocationsHttp, checkoutItemsData, bulkFindItems };
