const db = require("../models/index.js");
const logger = require('../utils/logger');
const notificationService = require("../config/notificationService.js")

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



module.exports = { saveFCMKey };
