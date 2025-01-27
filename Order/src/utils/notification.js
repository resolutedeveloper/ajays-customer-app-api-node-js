const axios = require("axios");
require("dotenv").config();

// Function to send notification to the user 

async function sendNotification(CustomerID, title, body) {
    try {
        if (!CustomerID || !title || !body) {
            throw new Error("All fields are neccessary!")
        }
        await axios.post(`${process.env.CUSTOMER_LOCAL_URL}/customefcm/send-notification-http`, { CustomerID, title, body }, {
            headers: { "Authorization": `Bearer ${process.env.HTTP_REQUEST_SECRET_KEY}` }
        });
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

// module exports
module.exports = { sendNotification };