module.exports = (sequelize, DataTypes) => {
const itemModel = sequelize.define("Items",{
    ItemID:{
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    CategoryID:{
        type: DataTypes.INTEGER,
    },
    ItemName:{
        type: DataTypes.STRING(200),
    },
    Description:{
        type: DataTypes.STRING(500),
    },
    UnitRate:{
        type: DataTypes.DECIMAL(8,4),
    },
    MRP:{
        type: DataTypes.DECIMAL(8,4),
    },
    BigUnit:{
        type: DataTypes.INTEGER,
    },
    SmallUnit:{
        type: DataTypes.INTEGER,
    },
    OperationalUnit:{
        type: DataTypes.INTEGER,
    },
    CostingUnit:{
        type: DataTypes.INTEGER,
    },
    SellingUnit:{
        type: DataTypes.INTEGER,
    },
    ConversionRatio:{
        type: DataTypes.INTEGER,
    },
    RateWithoutTax:{
        type: DataTypes.DECIMAL(8,4),
    },
    TaxForSale:{
        type: DataTypes.DECIMAL(8,4),
    },
    IsVisible:{
        type: DataTypes.BOOLEAN,
    },
    Image:{
        type: DataTypes.TEXT("long"),
    },
    Remarks:{
        type: DataTypes.STRING(300),
    },
    ItemOrder:{
        type: DataTypes.STRING(300),
    },
},{timestamps: false}
);
  return itemModel;
}