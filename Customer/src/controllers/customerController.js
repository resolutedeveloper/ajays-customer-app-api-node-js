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

async function deleteCustomerAccount(req, res) {
    try {
        const customerId = req?.UserDetail?.CustomerID;

        if (!customerId) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        const isExist = await db.customer.findOne({
            where: { CustomerID: customerId, IsDeleted: false }
        });

        if (!isExist) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        await db.customer.update({
            IsDeleted: true
        }, { where: { CustomerID: customerId } });

        await db.customerEmail.update({
            IsDeleted: true
        }, { where: { CustomerID: customerId } });

        return res.status(200).json({
            status: 'true',
            message: 'User deleted successfully.'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'false',
            message: 'Sorry! There was a server-side error.',
            error: error
        });
    }
}



module.exports = { getCustomer, getCustomerDetails, deleteCustomerAccount };