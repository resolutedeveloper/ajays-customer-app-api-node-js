module.exports = (sequelize, DataTypes)=>{
    const cityModel = sequelize.define("Cities",{
        CityID:{
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        CityName:{
            type: DataTypes.STRING(300),
        },
        StateID:{
            type: DataTypes.INTEGER,
        }

    },{timestamps: false});


    return cityModel;
}