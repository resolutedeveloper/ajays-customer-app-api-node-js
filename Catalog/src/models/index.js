// src/models/index.js
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const logger = require('../utils/logger'); // Custom logger for error tracking

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require('../../config/config')[env]; // Load database config for the current environment
const db = {};

let sequelize;

// Initialize Sequelize instance
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Log successful database connection
sequelize.authenticate()
    .then(() => logger.info('Database connected successfully'))
    .catch((error) => logger.error('Database connection failed:', error));

// Dynamically load all model files in the current directory
fs.readdirSync(__dirname)
    .filter((file) => {
        return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
    })
    .forEach((file) => {
        const modelPath = path.join(__dirname, file);
        const modelModule = require(modelPath);

        // Check if the imported module is a function or a class
        let model;
        if (typeof modelModule === 'function') {
            model = new modelModule(sequelize, Sequelize.DataTypes); // Instantiate the model class
        } else if (modelModule.prototype instanceof Sequelize.Model) {
            // ES6 class-based model
            model = new modelModule(sequelize, Sequelize.DataTypes);
        } else {
            throw new Error(`Invalid model format in file: ${file}`);
        }

        db[model.name] = model;
    });

// Set up associations if defined in the models
Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

// Sync the database (optional, can be set to `force: true` for development)
sequelize.sync({ alter: true })
    .then(() => logger.info('Database synchronization complete'))
    .catch((error) => logger.error('Database synchronization error:', error));

// Export the Sequelize instance and all models
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
