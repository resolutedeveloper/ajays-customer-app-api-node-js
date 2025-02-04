const logger = require('../utils/logger');
const { db } = require("../models/index.js");

const customerVersionHandler = async (req, res) => {
    try {

        const currentTimeUTC = new Date();
        const currentTimeIST = new Date(currentTimeUTC.getTime() + (5.5 * 60 * 60 * 1000));

        const { CustomerID } = req.UserDetail;

        const { Version } = req.body;

        if (!Version) {
            return res.status(400).json({ message: "Version is required" });
        }


        const newVersionEntry = await db.customerVerManagement.create({
            CustomerID,
            Version,
            CreateOn: currentTimeIST,

        });

        logger.info(`New version entry created for CustomerID: ${CustomerID}, Version: ${Version}`);
        return res.status(200).json({
            message: "New version entry created successfully",
            data: newVersionEntry
        });
    } catch (error) {
        logger.error(`Error processing customer version: ${error.message}`);
        return res.status(400).json({
            message: "Error processing customer version",
            error: error.message
        });
    }
};




module.exports = customerVersionHandler;
