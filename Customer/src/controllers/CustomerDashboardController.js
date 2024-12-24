const logger = require('../utils/logger');
const db = require("../models/index.js");
const name_update = async (req, res) => {
    try {
        const NameUpdated = await db.customer.update({ 
            Name: req.body.Name 
            }, { where: { 
                CustomerID: req.UserDetail.CustomerID 
            } 
        });
        logger.info(`User created: ${req.UserDetail.CustomerID} - ${req.body.Name}`);
        return res.status(200).json({ 
            message:'Customer name is updated.',
            data: NameUpdated,
        });
    } catch (error) {
        logger.error(`Error creating user: ${error.message}`); 
        res.status(400).json({ error: error.message,success: false, message: 'Error creating user' });
    }
};

const check_existing_customer = async (req, res) => {
    try {
        const FindCustomerExist = await db.customer.findOne({ where: { CustomerID: req.UserDetail.CustomerID } });
        if(FindCustomerExist.dataValues.Name){
            logger.info(`User created: ${req.UserDetail.CustomerID} - ${req.body.Name}`);
            return res.status(200).json({ 
                message:'customer already exists.'
            });
        }else{
            return res.status(400).json({ 
                message:"It's a new customer. Please update the customer name."
            });
        }
    } catch (error) {
        logger.error(`Error creating user: ${error.message}`); 
        res.status(400).json({ error: error.message,success: false, message: 'Error creating user' });
    }
};
module.exports = { name_update, check_existing_customer};