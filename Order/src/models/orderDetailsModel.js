module.exports = (sequelize, DataTypes) => {
    const OrderDetails = sequelize.define("OrderDetails", {
        OrderDetailsID: {
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
        Qty: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        CategoryID: {
            type: DataTypes.INTEGER,
        },
        CategoryName: {
            type: DataTypes.STRING,
        },
        ItemName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Description: {
            type: DataTypes.STRING,
        },
        UnitRate: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        MRP: {
            type: DataTypes.FLOAT,
        },
        BigUnit: {
            type: DataTypes.STRING,
        },
        BigUnitValue: {
            type: DataTypes.FLOAT,
        },
        SmallUnit: {
            type: DataTypes.STRING,
        },
        SmallUnitValue: {
            type: DataTypes.FLOAT,
        },
        OperationalUnit: {
            type: DataTypes.STRING,
        },
        OperationalUnitValue: {
            type: DataTypes.FLOAT,
        },
        CostingUnit: {
            type: DataTypes.STRING,
        },
        CostingUnitValue: {
            type: DataTypes.FLOAT,
        },
        SellingUnit: {
            type: DataTypes.STRING,
        },
        SellingUnitValue: {
            type: DataTypes.FLOAT,
        },
        ConversionRatio: {
            type: DataTypes.FLOAT,
        },
        RateWithoutTax: {
            type: DataTypes.FLOAT,
        },
        TaxForSale: {
            type: DataTypes.FLOAT,
        },
        IsVisible: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        Image: {
            type: DataTypes.STRING, // Use STRING for image URLs or paths
        },
        Remarks: {
            type: DataTypes.STRING,
        },
        ItemOrder: {
            type: DataTypes.INTEGER,
        }
    }, { timestamps: false });

    return OrderDetails;
};
