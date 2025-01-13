module.exports = (sequelize, DataTypes) => {
    const OrderDetailsTax = sequelize.define("OrderDetailsTax", {
        OrderDetailsTaxID: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
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
        TaxPercentage: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
    }, {
        timestamps: false
    });

    return OrderDetailsTax;
};
