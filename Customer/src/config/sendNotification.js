const admin = require('../utils/fireBaseConfig.js'); 
const db = require('../models/index.js');
const logger = require('../utils/logger');


const promotion = "promotion";
const success = "success";
const user = "user";
const error = "error";

const sendNotification = async (customerId, title, body, customData = {}) => {
    try {
        // Retrieve FCM key for the customer
        const customerFCM = await db.customerFCM.findOne({ where: { CustomerID: customerId } });
        console.log("🚀 ~ sendNotification ~ customerFCM:", customerFCM);

        if (!customerFCM) {
            throw new Error('FCM Key not found for this customer');
        }

        // Create the notification payload
        let notificationPayload = {
            notification: {
                title: title,
                body: body,
            },
            data: {}, // Initialize data as an empty object
            token: customerFCM.FCMKEY,
        };

        // Add custom data to payload based on status
        if (customData.status === promotion) {
            notificationPayload.data = {
                ...notificationPayload.data,
                status: promotion,
                offer: customData.offer || "No special offer available",
            };
        } else if (customData.status === success) {
            notificationPayload.data = {
                ...notificationPayload.data,
                status: success,
                message: customData.message || "Order successful",
            };
        } else if (customData.status === user) {
            notificationPayload.data = {
                ...notificationPayload.data,
                status: user,
                message: customData.message || "Thank you to come",
            };
        } else if (customData.status === error) {
            notificationPayload.data = {
                ...notificationPayload.data,
                status: error,
                errorMessage: customData.errorMessage || "An error occurred",
            };
        }

        console.log("🚀 ~ sendNotification ~ notificationPayload:", notificationPayload);

        // Send the notification to the customer's device
        const response = await admin.messaging().send(notificationPayload);
        logger.info('Notification sent:', response);

        return { success: true, response };
    } catch (error) {
        logger.error('Error sending notification:', error.message);
        return { success: false, error: error.message };
    }
};




module.exports = sendNotification;