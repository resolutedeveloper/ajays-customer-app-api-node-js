module.exports = (sequelize, DataTypes) => {
const unitModel = sequelize.define("Units",{
    UnitID:{
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    UnitName:{
        type: DataTypes.STRING(200),
    },
    UnitSName:{
        type: DataTypes.STRING(500),
    },
    IsVisible:{
        type: DataTypes.BOOLEAN,
    },
    Remarks:{
        type: DataTypes.STRING(500)
    }
},{timestamps: false}
);

    return unitModel;
}