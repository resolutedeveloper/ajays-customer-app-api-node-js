module.exports = (sequelize, DataTypes)=>{
    const cityModel = sequelize.define("City",{
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
    },{timeStamps: false});

    return cityModel;
}