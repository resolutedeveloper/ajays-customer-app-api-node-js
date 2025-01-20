module.exports = (sequelize, DataTypes) => {
    const OrderHistory = sequelize.define("OrderHistory", {
        OrderHistoryID: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        OrderID: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        OrderStatus: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Data: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        CreatedOn: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    }, { timestamps: false });

    return OrderHistory;
};
