module.exports = (sequelize, DataTypes) => {
const locationModel = sequelize.define("Location",{
    LocationID:{
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    LocationName:{
        type: DataTypes.STRING(200),
    },
    LocationSName:{
        type: DataTypes.STRING(500),
    },
    Address:{
        type: DataTypes.STRING(500),
    },
    PhNo1:{
        type: DataTypes.STRING(300),
    },
    PhNo2:{
        type: DataTypes.STRING(300),
    },
    IsVisible:{
        type: DataTypes.BOOLEAN,
    },
    isDefault:{
        type: DataTypes.BOOLEAN,
    },
    Digits:{
        type: DataTypes.INTEGER,
    },
    Remarks:{
        type: DataTypes.STRING(500),
    },
    EnableRounding:{
        type: DataTypes.INTEGER,
    },
    RoundDigits:{
        type: DataTypes.INTEGER,
    },
    CountryID:{
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    StateID:{
        type: DataTypes.INTEGER,
    },
    CityId:{
        type: DataTypes.INTEGER,
    },
    Latitude:{
        type: DataTypes.STRING(500),
    },
    Longitude:{
        type: DataTypes.STRING(500),
    },
    MinOrderValue:{
        type: DataTypes.INTEGER,
    },
    MinDeliveryTime:{
        type: DataTypes.INTEGER,
    },
    MinPickupTime:{
        type: DataTypes.INTEGER,
    },
    OutletOpeningTime:{
        type: DataTypes.TIME
    },
    OutletClosingTime:{
        type: DataTypes.TIME
    },
    Status:{
        type: DataTypes.STRING(300),
    },
    OwnersMobileNumber:{
        type: DataTypes.STRING(300),
    },
    ShopCode:{
        type: DataTypes.STRING(500),
    },
    IsLocationOnline:{
        type: DataTypes.BOOLEAN,
    },
},{timestamps: false,
});
    return locationModel;
}
