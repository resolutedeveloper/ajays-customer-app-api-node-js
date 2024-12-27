const admin = require('../utils/fireBaseConfig.js');  // Firebase initialization
const db = require("../models/index.js");
const logger = require('../utils/logger');

const saveFCMKey = async (req, res) => {
    try {
        const { FCMKEY } = req.body;
        const CustomerID = req.UserDetail.CustomerID;

        const existingFCMKey = await db.customerFCM.findOne({ where: { CustomerID } });
        if (existingFCMKey) {
            await db.customerFCM.update({ FCMKEY }, { where: { CustomerID } }); // Update FCM if it's there
            logger.info(`FCM Key updated for customer: ${CustomerID}`);
            return res.status(200).json({ message: 'FCM key updated successfully' });
        } else {
            await db.customerFCM.create({ CustomerID, FCMKEY });
            logger.info(`FCM Key saved for customer: ${CustomerID}`);
            return res.status(200).json({ message: 'FCM key saved successfully' });
        }

    } catch (error) {
        logger.error(`Error saving FCM key: ${error.message}`);
        return res.status(400).json({ message: 'Error saving FCM key', error: error.message });
    }
};


// services/sendNotification.js


const sendNotification = async (customerId, title, message) => {
    try {
        // Retrieve FCM key for the customer
        const customerFCM = await db.customerFCM.findOne({ where: { CustomerID: customerId } });
        console.log("🚀 ~ sendNotification ~ customerFCM:", customerFCM)

        if (!customerFCM) {
            throw new Error('FCM Key not found for this customer');
        }

        // Create the notification payload
        const payload = {
            notification: {
                title: title,
                body: message,
            },
            token: customerFCM.FCMKEY,  // Use the customer's FCM key to send the notification
        };

        // Send the notification to the customer's device
        const response = await admin.messaging().send(payload);
        logger.info('Notification sent:', response);

        return { success: true, response };
    } catch (error) {
        logger.error('Error sending notification:', error.message);
        return { success: false, error: error.message };
    }
};





module.exports = { saveFCMKey, sendNotification };
