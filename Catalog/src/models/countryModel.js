module.exports = (sequelize, DataTypes) =>{
    const countryModel = sequelize.define("Country",{
    CountryID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    CountryCode:{
        type: DataTypes.STRING(200),
    },
    CountryName:{
        type: DataTypes.STRING(300)
    },

    },{ timestamps: false,});


    return countryModel;
}