const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME_CUSTOMER,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        timezone: '+05:30', // Set your timezone here (e.g., '+00:00' for UTC)
        logging: false, // Disable SQL query logging (optional)
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('MySQL connected successfully with Sequelize');
    } catch (error) {
        console.log(process.env)
        console.error('Unable to connect to the database:', error);

        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };
