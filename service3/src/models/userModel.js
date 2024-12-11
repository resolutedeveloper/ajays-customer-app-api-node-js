const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize');

// Define the User model
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    timestamps: true, // Enable timestamps (created_at, updated_at)
    createdAt: 'created_at', // Rename default column names
    updatedAt: 'updated_at',
    tableName: 'users', // Specify table name explicitly
});

module.exports = User;
