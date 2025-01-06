module.exports = (sequelize, DataTypes) => {
    const customerModel = sequelize.define("Customer", {
        CustomerID: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        Name: {
            type: DataTypes.STRING(256),

        },
        ProfileImage: {
            type: DataTypes.STRING(500),

        },
        PhoneNumber: {
            type: DataTypes.TEXT,
        },
        EmailID: {
            type: DataTypes.TEXT,
        },
        DOB: {
            type: DataTypes.DATE,
        },
        Anniversary: {
            type: DataTypes.DATE,
        },
        Gender: {
            type: DataTypes.STRING(256),
        },
        LastLogin: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        CreatedBy: {
            type: DataTypes.STRING(256),
            allowNull: true,
        },
        CreatedOn: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        LastModifiedBy: {
            type: DataTypes.STRING(256),
            allowNull: true,
        },
        LastModifiedOn: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        IsActive:{
            type:DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        IsDeleted:{
            type:DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            allowNull: true
        },
    }, {
        timestamps: false,
    });
    return customerModel;
};