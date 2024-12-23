const db = require('../models');
const CUSTOMER = db.customer;
const logger = require('../utils/logger');

const createCustomer = async (req ,res) =>{
    try {
        // const customer = await CUSTOMER.findOne()

        const customer = await CUSTOMER.create(req.body);
        logger.info("Customer created: ", JSON.stringify(customer));

        res.status(201).json(customer);
    } catch (err) {
        logger.error(`Error creating Customer: ${err}`);
        res.status(500).json({ success: false, message: "Error creating Customer", error: err.message, });
    }

}

module.exports = {createCustomer};