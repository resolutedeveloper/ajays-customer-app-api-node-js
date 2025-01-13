module.exports = (sequelize, DataTypes)=>{
    const taxModel = sequelize.define("Tax",{
        ID:{
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        TaxName:{
            type: DataTypes.STRING(300),
        },
        CompanyID:{
            type: DataTypes.INTEGER,
        },
        IsVisible:{
            type: DataTypes.BOOLEAN,
        }

    },{timestamps: false});


    return taxModel;
}