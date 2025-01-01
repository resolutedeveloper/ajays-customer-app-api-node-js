const logger = require('../utils/logger');
const db = require("../models/index.js");

const createItem = async (req, res) => {
  try {
    const { ItemID, ItemName, Description, UnitRate, MRP, IsVisible, Image, Remarks } = req.body;

    // Validate required fields
    if (!ItemID || !ItemName) {
      return res.status(400).json({ message: "ItemID and ItemName are required." });
    }

    // Check if the item already exists
    const existingItem = await db.item.findOne({ where: { ItemID } });

    if (existingItem) {
      logger.warn(`Item with ItemID: ${ItemID} already exists.`);
      return res.status(409).json({ message: `Item with ItemID ${ItemID} already exists.` });
    }

    // Create a new item in the database
    const newItem = await db.item.create({
      ItemID,
      ItemName,
      Description,
      UnitRate,
      MRP,
      IsVisible,
      Image,
      Remarks,
    });

    return res.status(201).json({ message: "Item created successfully", item: newItem });
  } catch (error) {
    logger.error(`Error creating item: ${error.message}`);
    console.error("Error creating item:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


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
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};



module.exports = { createItem, getItemDetails };
