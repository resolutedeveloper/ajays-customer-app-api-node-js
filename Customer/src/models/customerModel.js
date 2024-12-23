module.exports = (sequelize, DataTypes) => {
    const customerModel = sequelize.define("Customer", {
        CustomerID: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        Name: {
            type: DataTypes.STRING(256),
            allowNull: true
        },
        PhoneNumber: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        EmailID: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        DOB: {
            type: DataTypes.DATE,
            allowNull: true
        },
        Anniversary: {
            type: DataTypes.DATE,
            allowNull: true
        },
        Gender: {
            type: DataTypes.STRING(256),
            allowNull: true
        },
        LastLogin: {
            type: DataTypes.DATE,
            allowNull: false
        },
        isActive:{
            type:DataTypes.BOOLEAN,
            allowNull: false
        },
        isDeleted:{
            type:DataTypes.BOOLEAN,
            allowNull: false
        },
        CreatedBy: {
            type: DataTypes.STRING(256),
            allowNull: false
        },
        CreatedOn: {
            type: DataTypes.DATE,
            allowNull: false
        },
        LastModifiedBy: {
            type: DataTypes.STRING(256),
            allowNull: false
        },
        LastModifiedOn: {
            type: DataTypes.DATE,
            allowNull: false
        },
    }, {
        timestamps: false,
    });
    return customerModel;
};