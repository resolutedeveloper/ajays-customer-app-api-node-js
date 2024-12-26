module.exports = (sequelize, DataTypes) => {
    const historyCustomerModel = sequelize.define("HistoryCustomer", {
        HistoryCustomerID: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        CustomerID: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4, // Automatically generate UUID if not provided
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
        LastUpdateBy: {
            type: DataTypes.STRING(256),
            allowNull: false
        },
    }, {
        timestamps: false,
    });
    
    return historyCustomerModel;
};
