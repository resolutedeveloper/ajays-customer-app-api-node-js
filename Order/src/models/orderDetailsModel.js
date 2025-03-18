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
            type: DataTypes.STRING,
            allowNull: false,
        },
        MRP: {
            type: DataTypes.STRING,
        },
        BigUnit: {
            type: DataTypes.INTEGER,
        },
        BigUnitValue: {
            type: DataTypes.STRING,
        },
        SmallUnit: {
            type: DataTypes.STRING,
            allowNull: true
        },
        SmallUnitValue: {
            type: DataTypes.STRING,
            allowNull: true
        },
        OperationalUnit: {
            type: DataTypes.STRING,
        },
        OperationalUnitValue: {
            type: DataTypes.STRING,
        },
        CostingUnit: {
            type: DataTypes.STRING,
        },
        CostingUnitValue: {
            type: DataTypes.STRING,
        },
        SellingUnit: {
            type: DataTypes.STRING,
        },
        SellingUnitValue: {
            type: DataTypes.STRING,
        },
        ConversionRatio: {
            type: DataTypes.STRING,
        },
        RateWithoutTax: {
            type: DataTypes.STRING,
        },
        TaxForSale: {
            type: DataTypes.STRING,
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
            type: DataTypes.STRING,
        },
        Remark: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        isRatingDone:{
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, { timestamps: false });

    return OrderDetails;
};
