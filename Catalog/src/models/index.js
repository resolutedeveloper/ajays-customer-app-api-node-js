const dbConfig = process.env;
const { Sequelize, DataTypes } = require("sequelize");
require('dotenv').config();

const sequelize = new Sequelize(dbConfig.DB_NAME_CATALOG, dbConfig.DB_USER, dbConfig.DB_PASSWORD, {
    host: dbConfig.DB_HOST,
    dialect: 'mysql',
    dialectModule: require('mysql2'),
    logging: false,
    alter: true,
    port: 3306,                // MySQL port (default is 3306)
    dialectOptions: {
        multipleStatements: true,
    },
});
const sequelizeLog = new Sequelize(dbConfig.DB_NAME_LOG, dbConfig.DB_USER, dbConfig.DB_PASSWORD, {
    host: dbConfig.DB_HOST,
    dialect: 'mysql',
    dialectModule: require('mysql2'),
    logging: false,
    alter: true,
    port: 3306,                // MySQL port (default is 3306)
    dialectOptions: {
        multipleStatements: true,
    },
});

sequelize.authenticate()
    .then(() => {
        console.log("connected..");
    })
    .catch((err) => {
        console.log("Error" + err);
    });
sequelizeLog.authenticate()
    .then(() => {
        console.log("Log connected..");
    })
    .catch((err) => {
        console.log("Error" + err);
    });
const db = {};
const dbLog = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

dbLog.Sequelize = Sequelize;
dbLog.sequelize = sequelizeLog;

db.company = require('../models/companyModel')(sequelize, DataTypes);
db.location = require('../models/locationModel')(sequelize, DataTypes);
db.unit = require('../models/unitModel')(sequelize, DataTypes);
db.category = require('../models/categoryModel')(sequelize, DataTypes);
db.item = require('../models/itemModel')(sequelize, DataTypes);
db.itemAllocation = require('../models/itemAllocationModel')(sequelize, DataTypes);
db.categoryAllocation = require('../models/categoryAllocationModel')(sequelize, DataTypes);
db.country = require('../models/countryModel')(sequelize, DataTypes);
db.state = require('../models/stateModel')(sequelize, DataTypes);
db.city = require('../models/cityModel')(sequelize, DataTypes);
db.itemLocationRate = require('./itemRateModel')(sequelize, DataTypes);
db.itemHistory = require('./itemHistoryModel')(sequelize, DataTypes);
db.tax = require('../models/Tax')(sequelize, DataTypes);
db.taxDefinition = require('../models/taxDefinition')(sequelize, DataTypes);
db.taxDefinitionDetails = require('../models/taxDefinitionDetails')(sequelize, DataTypes);
db.itemTaxDet = require('../models/itemTaxDet')(sequelize, DataTypes);
db.LocationCompanyMapping = require('./locationCompanyMapping')(sequelize, DataTypes);


// Association of tables
db.categoryAllocation.hasOne(db.category, { foreignKey: 'CategoryID' });
db.category.belongsTo(db.categoryAllocation, { foreignKey: 'CategoryID' });

db.location.hasOne(db.LocationCompanyMapping, { foreignKey: 'LocationID' });
db.LocationCompanyMapping.belongsTo(db.location);

db.city.hasMany(db.location, { foreignKey: "CityId", sourceKey: "CityID" });
db.location.belongsTo(db.city, { foreignKey: "CityId", targetKey: "CityID" });

// Logger <<-->>
dbLog.exceptions = require("./exceptions")(sequelizeLog, DataTypes);

db.sequelize.sync({ force: false, alter: true })
    .then(() => {
        console.log("yes re-sync done!");
    })
    .catch((error) => {
        console.error("Error while syncing the database:", error);
    });
dbLog.sequelize.sync({ force: false, alter: true })
    .then(() => {
        console.log("Log re-sync done!");
    })
    .catch((error) => {
        console.error("Error while syncing the database:", error);
    });
module.exports = { db, dbLog };