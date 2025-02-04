const logger = require('../utils/logger');
const { db } = require("../models/index.js");
const { convertAndSaveImage } = require('../services/imageServices.js');



// Assuming you're using express and sequelize to fetch details from catalog
const getItemDetails = async (req, res) => {
  try {
    const itemID = req.params.itemID; // Extract ItemID from URL params
    console.log("🚀 ~ Fetching item details for ItemID:", itemID);

    if (!itemID) {
      return res.status(400).json({ message: "ItemID is required" });
    }

    // Check if the model reference is correct
    const itemDetails = await db.item.findOne({ // If it's the 'item' table, change this
      where: { ItemID: itemID }
    });

    if (!itemDetails) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Return item details
    return res.status(200).json({
      message: "Item details fetched successfully",
      itemDetails
    });
  } catch (error) {
    console.error("Error fetching item details:", error.message);
    return res.status(400).json({ message: "Internal server error", error: error.message });
  }
};

const getCatalogData = (req, res) => {
  try {
    const customerDetails = req.UserDetail;
    console.log("🚀 ~ getCatalogData ~ customerDetails:", customerDetails)
    res.status(200).json({
      message: "Catalog data retrieved successfully",
      customerDetails
    });
  } catch (error) {
    console.error("Error fetching catalog data:", error);
    res.status(500).json({ message: "Server-side error fetching catalog data" });
  }
}


const saveImage = async (req, res) => {
  try {
    const { baseImage, ItemID } = req.body;

    if (!baseImage) {
      return res.status(400).json({ success: false, message: 'No image provided' });
    }

    if (!ItemID) {
      return res.status(400).json({ success: false, message: 'No ItemID provided' });
    }

    const fileName = await convertAndSaveImage(baseImage, 200, 200, 80);

    const updatedItem = await db.item.update(
      { Image: fileName },
      { where: { ItemID } }
    );

    if (updatedItem[0] === 0) {
      return res.status(400).json({
        success: false,
        message: `Item with ID ${ItemID} not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Image updated successfully.",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};




module.exports = { getItemDetails, getCatalogData, saveImage };
