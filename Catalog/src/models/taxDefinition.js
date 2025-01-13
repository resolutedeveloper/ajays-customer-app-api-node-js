module.exports = (sequelize, DataTypes)=>{
    const taxDefinitionModel = sequelize.define("TaxDefinition",{
        ID:{
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        TaxDefinition:{
            type: DataTypes.STRING(300),
        },
        CompanyID:{
            type: DataTypes.INTEGER,
        },
        IsVisible:{
            type: DataTypes.BOOLEAN,
        }

    },{timestamps: false});


    return taxDefinitionModel;
}