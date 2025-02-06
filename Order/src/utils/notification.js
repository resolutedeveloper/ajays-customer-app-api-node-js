const axios = require("axios");
require("dotenv").config();

// Function to send notification to the user 

async function sendNotification(CustomerID, title, body, customData) {
    try {
        if (!CustomerID || !title || !body || !customData) {
            throw new Error("All fields are neccessary!")
        }
        await axios.post(`${process.env.CUSTOMER_LOCAL_URL}/customefcm/send-notification-http`, { CustomerID, title, body, customData }, {
            headers: { "Authorization": "Bearer " + process.env.HTTP_REQUEST_SECRET_KEY }
        });
        return true;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

// module exports
module.exports = { sendNotification };