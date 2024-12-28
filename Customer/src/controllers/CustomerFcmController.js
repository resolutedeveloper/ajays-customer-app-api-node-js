const db = require("../models/index.js");
const logger = require('../utils/logger');
const sendNotification = require('../config/sendNotification.js');

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
