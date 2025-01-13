module.exports = (sequelize, DataTypes)=>{
    const taxDefinitionDetailsModel = sequelize.define("TaxDefinitionDetails",{
        DetailsID:{
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        TaxDefinitionID:{
            type: DataTypes.INTEGER,
        },
        TaxID:{
            type: DataTypes.INTEGER,
        },
        Percentage:{
            type: DataTypes.FLOAT,
        },
        Priority:{
            type: DataTypes.INTEGER,
        }

    },{timestamps: false});


    return taxDefinitionDetailsModel;
}