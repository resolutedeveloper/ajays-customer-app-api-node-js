module.exports =(sequelize, DataTypes)=>{
    const rateAppModel = sequelize.define("RateApp",{
        RateAppID: {
            type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        },
        CustomerID:{
            type: DataTypes.UUID,
            allowNull: false,
        },
        Rating:{
            type: DataTypes.FLOAT,
            allowNull: false
        },
        AverageRatingApp: {
            type: DataTypes.FLOAT,
            allowNull: true,
          }
          
    },{timestamps: false});

    return rateAppModel;
}