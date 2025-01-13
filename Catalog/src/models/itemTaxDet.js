module.exports = (sequelize, DataTypes)=>{
    const itemTaxDetModel = sequelize.define("ItemTaxDet",{
        ItemID:{
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        BatchID:{
            type: DataTypes.INTEGER,
        },
        TaxDefID:{
            type: DataTypes.INTEGER,
        },
        IsInclusive:{
            type: DataTypes.INTEGER,
        },
        CompanyID:{
            type: DataTypes.INTEGER,
        }

    },{timestamps: false});


    return itemTaxDetModel;
}