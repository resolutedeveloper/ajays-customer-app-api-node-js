const dbConfig = process.env;
const { Sequelize, DataTypes } = require("sequelize");
require('dotenv').config();

const sequelize = new Sequelize(dbConfig.DB_NAME_ORDER, dbConfig.DB_USER, dbConfig.DB_PASSWORD, {
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

db.order = require('../models/orderModel')(sequelize, DataTypes);
db.rating = require('../models/ratingModel')(sequelize, DataTypes);
db.orderDetails = require('../models/orderDetailsModel.js')(sequelize, DataTypes);
db.orderDetailsTax = require('../models/orderDetailsTaxModel.js')(sequelize, DataTypes);
db.ratingItem = require('../models/ratingItemModel.js')(sequelize, DataTypes);
db.feedback = require('../models/feedbackModel.js')(sequelize, DataTypes);
db.orderHistory = require('../models/orderHistoryModel.js')(sequelize, DataTypes);

//Associatiom



db.sequelize.sync({ force: false, alter: true })
    .then(() => {
        console.log("yes re-sync done!");
    })
    .catch((error) => {
        console.error("Error while syncing the database:", error);
    });
module.exports = db;