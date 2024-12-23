module.exports = (sequelize, DataTypes)=>{
    const itemLocationRateModel = sequelize.define("ItemLocationRate",{
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        ItemID:{
            type: DataTypes.INTEGER,
        },
        LocationID:{
            type: DataTypes.INTEGER,
        },
        Rate:{
            type: DataTypes.DECIMAL(8,4),
        },
        TaxForSale:{
            type: DataTypes.DECIMAL(8,4),
        }
    },{timeStamps: false});

    return itemLocationRateModel;
}