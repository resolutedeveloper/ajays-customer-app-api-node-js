const { Sequelize } = require('sequelize');
// const logger = require('../../src/utils/logger');
const sequelize = new Sequelize(
    process.env.DB_NAME_CUSTOMER,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        timezone: '+05:30', // Set your timezone here (e.g., '+00:00' for UTC)
        logging: false, // Disable SQL query logging (optional)
        port: process.env.DB_PORT || 3306, // Set the MySQL port (default 3306)
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
        console.log('MySQL & LOG connected successfully with Sequelize');
    } catch (error) {
        console.log(process.env)
        console.log('Unable to connect to the database:', error);

        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };
