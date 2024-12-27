const db = require('../models');  // Import the db object from index.js
const location = db.location;  // Get the location model from the db object
const logger = require("../utils/logger");
const { Op } = require('sequelize');

const itemlist = async (req, res) => {
    try {
      const { ItemID } = req.params;
      const itemlist = await db.item.findOne({
        where: {
          ItemID: ItemID,
        },
      });
  
      
      if(itemlist){
        return res.status(200).json({
            message: 'product details found successfully',
            data: itemlist
        });
        }else{
            return res.status(400).send({
                ErrorCode: "VALIDATION", 
                ErrorMessage: 'Product details not found' 
            });
        }
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Error fetching product",
        error: err.message || err,
      });
    }
};

const locationDetail = async (req, res) => {
    try {
      const { LocationID } = req.params;
      const location = await db.location.findOne({
        where: {
          LocationID: LocationID,
        },
      });
  
      
      if(location){
        return res.status(200).json({
            message: 'Location details found successfully',
            data: location,
            banner:'staticbanner.jpg'
        });
        }else{
            return res.status(400).send({
                ErrorCode: "VALIDATION", 
                ErrorMessage: 'Location details not found' 
            });
        }
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Error fetching Location",
        error: err.message || err,
      });
    }
  };

  const citystores = async (req, res) => {
    try {
        const Cities = await db.sequelize.query(
            `SELECT DISTINCT c.*
             FROM cities c
             INNER JOIN locations l ON c.CityID = l.CityID`,
            {
                type: db.Sequelize.QueryTypes.SELECT,
            }
        );
  
      
      if(Cities){
        return res.status(200).json({
            message: 'Cities details found successfully',
            data: Cities
        });
        }else{
            return res.status(400).send({
                ErrorCode: "VALIDATION", 
                ErrorMessage: 'Cities details not found' 
            });
        }
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Error fetching Cities",
        error: err.message || err,
      });
    }
  };

  const latlonglocation = async (req, res) => {
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
            
            const locations = await db.location.findAll({
              where: {
                CityID: LatLongcityID,
              },
            });

            if(locations){
              return res.status(200).json({
                  message: 'Location details found successfully',
                  data: locations
              });
              }else{
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
                CityID: LatLongcityID,
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

            
            if(locations){
              return res.status(200).json({
                  message: 'Location details found successfully',
                  data: [{"Location":locations,"CategoryData":CategoryData,"ItemData":ItemData}]
              });
              }else{
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
module.exports = { itemlist, locationDetail, citystores, latlonglocation, latlonglocationItem};
