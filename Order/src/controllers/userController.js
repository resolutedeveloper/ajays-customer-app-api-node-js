const { User } = require('../models/userModel');
const logger = require('../utils/logger');

// Create user function
const createUser = async (req, res) => {
    try {
        const { name, email } = req.body;
        const newUser = await User.create({ name, email });
        logger.info(`User created: ${newUser.id} - ${newUser.name}`);  // Log user creation
        res.status(201).json(newUser);
    } catch (err) {
        logger.error(`Error creating user: ${err.message}`);  // Log errors
        res.status(500).send({ success: false, message: 'Error creating user' });
    }
};

// Get all users function
const getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        logger.info(`Fetched ${users.length} users`);  // Log successful fetch
        res.status(200).json(users);
    } catch (err) {
        logger.error(`Error fetching users: ${err.message}`);  // Log errors
        res.status(500).send({ success: false, message: 'Error fetching users' });
    }
};

module.exports = { createUser, getUsers };
