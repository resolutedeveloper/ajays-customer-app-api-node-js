// Function to send notification to the user
require("dotenv").config();

async function sendNotification(CustomerID, title, body) {
    try {
        if (!CustomerID || !title || !body) {
            throw new Error("All fields are neccessary!")
        }
        throw new Error()
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}