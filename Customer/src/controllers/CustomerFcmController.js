const sendNotification = require("../config/sendNotification.js");
const db = require("../models/index.js");
const logger = require('../utils/logger');


const saveFCMKey = async (req, res) => {
    try {
        const { FCMKEY } = req.body;
        const CustomerID = req.UserDetail.CustomerID;

        console.log("🚀 ~ saveFCMKey ~ req.body:", req.body);
        console.log("🚀 ~ saveFCMKey ~ CustomerID:", CustomerID);

        if (!FCMKEY || !CustomerID) {
            return res.status(400).json({ message: "FCM Key or CustomerID is missing in the request" });
        }

        if (FCMKEY.trim() === "") {
            return res.status(400).json({ message: "FCM Key cannot be an empty string" });
        }


        const existingFCMKey = await db.customerFCM.findOne({ where: { CustomerID } });

        if (!existingFCMKey) {

            console.log("🚀 ~ No existing FCM Key found, creating new...");
            await db.customerFCM.create({ CustomerID, FCMKEY });
            console.log("🚀 ~ FCM Key saved for customer:", CustomerID);
            return res.status(200).json({ message: 'FCM key saved successfully' });
        } else {
   
            return res.status(400).json({ message: 'FCM key already exists for this customer' });
        }

    } catch (error) {

        console.error("~ Error saving FCM Key:", error);
        return res.status(400).json({
            message: 'Error saving FCM key',
            error: error.message || 'Internal Server Error',
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
