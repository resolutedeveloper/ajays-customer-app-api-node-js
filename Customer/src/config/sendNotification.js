const admin = require('../utils/fireBaseConfig.js');
const db = require('../models/index.js');

const promotion = "promotion";
const success = "success";
const user = "user";
const error = "error";

const sendNotification = async (customerId, title, body, customData = {}) => {
    try {
        const customerFCM = await db.customerFCM.findOne({ where: { CustomerID: customerId } });

        if (!customerFCM) {
            // throw new Error('FCM Key not found for this customer');
            return { success: true };
        }

        console.log(" ~ sendNotification ~ customData:", customData);


        const isIOS = customerFCM.FCMKEY.startsWith("ios_");
        const isAndroid = customerFCM.FCMKEY.startsWith("android_");

        let notificationPayload = {
            notification: {
                title: title,
                body: body,
            },
            token: customerFCM.FCMKEY,
        };


        if (isIOS) {
            notificationPayload.apns = {
                payload: {
                    aps: {
                        alert: {
                            title: title,
                            body: body,
                        },
                    },
                },
            };
        }

        // Add data based on status
        if (customData.status === promotion) {
            notificationPayload.data = {
                status: promotion,
                offer: customData.offer || "No special offer available",
            };
        } else if (customData.status === success) {
            notificationPayload.data = {
                status: success,
                message: customData.message || "Order successful",
            };
        } else if (customData.status === user) {
            notificationPayload.data = {
                status: user,
                message: customData.message || "Thank you for coming",
            };
        } else if (customData.status === error) {
            notificationPayload.data = {
                status: error,
                errorMessage: customData.errorMessage || "An error occurred",
            };
        }

        console.log("🚀 ~ sendNotification ~ notificationPayload:", notificationPayload);

        const response = await admin.messaging().send(notificationPayload);
        console.log('Notification sent:', response);

        return { success: true, response };
    } catch (err) {
        console.error('Error sending notification:', err.message);
        return { success: false, error: err.message };
    }
};

module.exports = sendNotification;

