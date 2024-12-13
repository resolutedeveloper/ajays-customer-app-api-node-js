const logger = require('../utils/logger');
const db = require("../models/index.js");

// Import the logger

/*
// Create Company function
const createCompany = async (req, res) => {
    try {
        const { name, email } = req.body;
        const newCompany = await Company.create({ name, email });
        logger.info(`Company created: ${newCompany.id} - ${newCompany.name}`);  // Log Company creation
        res.status(201).json(newCompany);
    } catch (err) {
        logger.error(`Error creating Company: ${err.message}`);  // Log errors
        res.status(500).send({ success: false, message: 'Error creating Company' });
    }
};

// Get all Companys function
const getCompanys = async (req, res) => {
    try {
        const Companys = await Company.findAll();
        logger.info(`Fetched ${Companys.length} Companys`);  // Log successful fetch
        res.status(200).json(Companys);
    } catch (err) {
        logger.error(`Error fetching Companys: ${err.message}`);  // Log errors
        res.status(500).send({ success: false, message: 'Error fetching Companys' });
    }
};

module.exports = { createCompany, getCompanys };
*/