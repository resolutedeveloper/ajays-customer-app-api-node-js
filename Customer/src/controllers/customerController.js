const db = require("../models/index.js");
const logger = require('../utils/logger');
const getCustomer = async (req, res) => {
    try {
        const customerId = req.params.customerId;  // Correct parameter name
        console.log("🚀 ~ getCustomer ~ customerId:", customerId);

        // Adjust the query to match your actual column name (CustomerID)
        const customer = await db.customer.findOne({
            where: {
                CustomerID: customerId  // Use the correct column name here
            }
        });
        console.log("🚀 ~ getCustomer ~ customer:", customer);

        if (customer) {
            res.json(customer);
        } else {
            res.status(404).json({ message: 'Customer not found' });
        }
    } catch (error) {
        console.error('Error fetching customer data:', error.message);
        res.status(500).json({ message: 'Failed to fetch customer data' });
    }
};



module.exports = {getCustomer}