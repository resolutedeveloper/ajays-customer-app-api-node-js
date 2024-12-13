const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize');

// Define the User model
const companyModel = sequelize.define("Company", {
    CompanyID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    CompanyName: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    CompanysName: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    CompanyLogo: {
        type: DataTypes.BLOB,
        allowNull: true
    },
    CompanyNo1: {
        type: DataTypes.STRING(300),
        allowNull: true
    },
    CompanyNo2: {
        type: DataTypes.STRING(300),
        allowNull: true
    },
    Address: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    AddressLine2: {
        type: DataTypes.STRING(400),
        allowNull: true
    },
    AddressLine3: {
        type: DataTypes.STRING(400),
        allowNull: true
    },
    GSTNo: {
        type: DataTypes.STRING(300),
        allowNull: true
    },
    GSTWEF: {
        type: DataTypes.DATE,
        allowNull: true
    },
    IsVisible: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    Remarks: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    MerchantKey: {
        type: DataTypes.STRING(400),
        allowNull: true
    },
}, {
    timestamps: false,
});

module.exports = companyModel;
