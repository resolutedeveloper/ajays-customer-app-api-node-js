module.exports = (sequelize, DataTypes) => {
    const OrderDetailsTax = sequelize.define("OrderDetailsTax", {
        OrderDetailsTaxID: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        OrderID: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        ItemID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        TaxID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        TaxName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Percentage: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
    }, {
        timestamps: false
    });

    return OrderDetailsTax;
};
