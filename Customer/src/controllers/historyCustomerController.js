const logger = require('../utils/logger');
const db = require("../models/index.js");


const historycustmoer = async (req, res) => {
    try {
        const currentTimeUTC = new Date();
        const currentTimeIST = new Date(currentTimeUTC.getTime() + (5.5 * 60 * 60 * 1000));

        // current data find
        const existingCustomer = await db.customer.findOne({ where: { CustomerID: req.UserDetail.CustomerID } });

        
        if (!existingCustomer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // save old data
        await db.historyCustomer.create({
            CustomerID: existingCustomer.CustomerID,
            Name: existingCustomer.Name,
            PhoneNumber: existingCustomer.PhoneNumber,
            EmailID: existingCustomer.EmailID,
            LastUpdateBy: existingCustomer.Name,
          
        });

        // update data
        const NameUpdated = await db.customer.update({
            Name: req.body.Name,
            EmailID: req.body.EmailID,
            PhoneNumber: req.body.PhoneNumber,
            LastLogin: currentTimeIST,
            CreatedOn: currentTimeIST,
            LastModifiedOn: currentTimeIST,  // Update modification timestamp
        }, { where: { CustomerID: req.UserDetail.CustomerID } });

        logger.info(`Customer updated with history: ${req.UserDetail.CustomerID} - ${req.body.Name}`);

        if (NameUpdated[0] === 1){

            return res.status(200).json({
                message: 'Customer name updated successfully with history.',
                data: NameUpdated,
            });
        }

    } catch (error) {
        logger.error(`Error updating customer with history: ${error.message}`);
        return res.status(400).json({
            error: error.message,
            success: false,
            message: 'Error updating customer name with history',
        });
    }
};


module.exports = {historycustmoer}