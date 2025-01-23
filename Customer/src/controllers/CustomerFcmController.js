const sendNotification = require("../config/sendNotification.js");
const db = require("../models/index.js");
const logger = require('../utils/logger');



const saveFCMKey = async (req, res) => {
  try {
    const { FCMKEY, platform } = req.body;
    const CustomerID = req.UserDetail?.CustomerID;


    if (!FCMKEY || !CustomerID) {
      return res.status(400).json({ message: "FCM Key or CustomerID is missing in the request" });
    }

    if (FCMKEY.trim() === "") {
      return res.status(400).json({ message: "FCM Key cannot be an empty string" });
    }

    if (!["android", "ios"].includes(platform)) {
      return res.status(400).json({ message: "Invalid platform. Must be 'android' or 'ios'" });
    }

    const existingFCMKey = await db.customerFCM.findOne({ where: { CustomerID } });

    if (!existingFCMKey) {
      await db.customerFCM.create({ CustomerID, FCMKEY, platform });
      return res.status(200).json({ message: 'FCM key saved successfully' });
    } else {
      await db.customerFCM.update(
        { FCMKEY, platform },
        { where: { CustomerID } }
      );
      return res.status(200).json({ message: 'FCM key updated successfully' });
    }
  } catch (error) {
    return res.status(400).json({
      message: 'Error saving FCM key',
      error: error.message || 'Internal Server Error',
    });
  }
};



const sendCustomerNotification = async (req, res) => {
  try {
    const CustomerID = req?.UserDetail?.CustomerID;
    const { title, body, customData } = req.body;

    if (!CustomerID || !title || !body) {
      return res.status(400).json({ message: 'CustomerID, title, and body are required.' });
    }
    const result = await sendNotification(CustomerID, title, body, customData || {});

    if (result.success) {
      return res.status(200).json({ message: 'Notification sent successfully' });
    } else {
      return res.status(400).json({ message: 'Error sending notification', error: result.error });
    }
  } catch (error) {
    console.error('Error sending notification:', error.message);
    return res.status(400).json({ message: 'Error sending notification', error: error.message });
  }
};




module.exports = { saveFCMKey, sendCustomerNotification };
