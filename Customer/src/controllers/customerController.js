const { db } = require("../models/index.js");
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

async function getCustomerDetails(req, res) {
    try {
        const { UserDetail } = req;
        if (!UserDetail || !UserDetail.CustomerID) {
            return res.status(400).json({
                message: "Invalid token! Login again"
            })
        }
        const customerDetails = await db.customer.findOne({
            where: { CustomerID: UserDetail.CustomerID }
        });
        if (!customerDetails) {
            return res.status(404).json({
                message: "User not found"
            })
        }
        return res.status(200).json({
            message: 'Success',
            customerDetails: customerDetails
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Sorry! There was an server-side error'
        });
    }
}



module.exports = { getCustomer, getCustomerDetails }