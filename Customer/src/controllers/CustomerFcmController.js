const db = require("../models/index.js");
const logger = require('../utils/logger');
const sendNotification = require('../config/sendNotification.js');


const saveFCMKey = async (req, res) => {
    try {
        const { FCMKEY } = req.body;
        const CustomerID = req.UserDetail.CustomerID; // Get CustomerID from the token

        // Log the request and CustomerID for debugging
        console.log("🚀 ~ saveFCMKey ~ req.body:", req.body);
        console.log("🚀 ~ saveFCMKey ~ CustomerID:", CustomerID);

        // Validation for FCMKEY and CustomerID
        if (!FCMKEY || !CustomerID) {
            return res.status(400).json({ message: "FCM Key or CustomerID is missing in the request" });
        }

        // Additional validation to check if FCMKEY is an empty string
        if (FCMKEY.trim() === "") {
            return res.status(400).json({ message: "FCM Key cannot be an empty string" });
        }

        // Check if the FCM key already exists for this customer
        const existingFCMKey = await db.customerFCM.findOne({ where: { CustomerID } });

        // If no existing record, create a new one
        if (!existingFCMKey) {
            // Create a new FCM Key record
            console.log("🚀 ~ No existing FCM Key found, creating new...");
            await db.customerFCM.create({ CustomerID, FCMKEY });
            console.log("🚀 ~ FCM Key saved for customer:", CustomerID);
            return res.status(200).json({ message: 'FCM key saved successfully' });
        } else {
            // If FCM key already exists for the customer, handle accordingly
            return res.status(400).json({ message: 'FCM key already exists for this customer' });
        }

    } catch (error) {
        // Log the error with more context
        console.error("🚨 ~ Error saving FCM Key:", error);
        return res.status(500).json({
            message: 'Error saving FCM key',
            error: error.message || 'Internal Server Error',
            details: error.stack || 'No stack trace available'
        });
    }
};




const sendCustomerNotification = async (req, res) => {
    const CustomerID = req.UserDetail?.CustomerID;
    const { title, body, customData } = req.body;

    if (!CustomerID || !title || !body) {
        return res.status(400).json({ message: 'CustomerID, title, and body are required.' });
    }

    try {
        // If customData not provided, default an empty object
        const result = await sendNotification(CustomerID, title, body, customData || {});

        if (result.success) {
            return res.status(200).json({ message: 'Notification sent successfully' });
        } else {
            return res.status(400).json({ message: 'Error sending notification', error: result.error });
        }
    } catch (error) {
        logger.error('Error sending notification:', error.message);
        return res.status(400).json({ message: 'Error sending notification', error: error.message });
    }
};




module.exports = { saveFCMKey, sendCustomerNotification };
