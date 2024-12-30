module.exports = (sequelize, DataTypes)=>{
    const itemLocationRateModel = sequelize.define("ItemLocationRate",{
        ID:{
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
    },{timestamps: false});

    return itemLocationRateModel;
}