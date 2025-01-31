const dbConfig = process.env;
const { Sequelize, DataTypes } = require("sequelize");
require('dotenv').config();

const sequelize = new Sequelize(dbConfig.DB_NAME_CUSTOMER, dbConfig.DB_USER, dbConfig.DB_PASSWORD, {
    host: dbConfig.DB_HOST,
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
        multipleStatements: true, // Yeh zaroori hai
    },
});
sequelize.authenticate()
    .then(() => {
        console.log("connected..");
    })
    .catch((err) => {
        console.log("Error" + err);
    });
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.customer = require('../models/customerModel')(sequelize, DataTypes);
db.customerEmail = require('../models/customerEmailModel')(sequelize, DataTypes);
db.customerMobile = require('../models/customerMobileModel')(sequelize, DataTypes);
db.favoriteLocation = require('../models/favoriteLocationModel')(sequelize, DataTypes);
db.mobileVerificationOTP = require('../models/mobileVerificationOTPModel')(sequelize, DataTypes);
db.emailVerificationOTP = require('../models/emailVerificationOTPModel')(sequelize, DataTypes);
db.customerFCM = require('../models/customerFCMModel')(sequelize, DataTypes);
db.customerVerManagement = require('../models/customerVerManagementModel')(sequelize, DataTypes);
db.historyCustomer = require('../models/historyCustomerModel')(sequelize, DataTypes);

//version
db.VersionManagementSupport = require('../models/VersionManagementSupportModel')(sequelize, DataTypes);
db.VersionManagement = require('../models/VersionManagementModel')(sequelize, DataTypes);



db.sequelize.sync({ force: false, alter: true })
    .then(() => {
        console.log("yes re-sync done!");
    })
    .catch((error) => {
        console.error("Error while syncing the database:", error);
    });
module.exports = db;