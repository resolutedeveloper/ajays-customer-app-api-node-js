const { Sequelize } = require('sequelize');
const logger = require('../../src/utils/logger');
const sequelize = new Sequelize(
    process.env.DB_NAME_CUSTOMER,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        timezone: '+05:30', // Set your timezone here (e.g., '+00:00' for UTC)
        logging: false, // Disable SQL query logging (optional)
        dialectOptions: {
            multipleStatements: true, // Yeh zaroori hai
        },
    }
);

const sequelizeLog = new Sequelize(
    process.env.DB_NAME_LOG,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        timezone: '+05:30', // Set your timezone here (e.g., '+00:00' for UTC)
        logging: false, // Disable SQL query logging (optional)
        dialectOptions: {
            multipleStatements: true, // Yeh zaroori hai
        },
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        await sequelizeLog.authenticate();
        logger.info('MySQL & LOG connected successfully with Sequelize');
    } catch (error) {
        logger.info(process.env)
        logger.info('Unable to connect to the database:', error);

        process.exit(1);
    }
};

module.exports = { sequelize, connectDB, sequelizeLog };
