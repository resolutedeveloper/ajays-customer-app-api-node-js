module.exports = (sequelize, DataTypes)=>{
    const stateModel = sequelize.define("State",{
        StateID:{
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        StateName:{
            type: DataTypes.STRING(300),
        },
        CountryID:{
            type: DataTypes.INTEGER,
        }
    },{timestamps: false});

    return stateModel;
}