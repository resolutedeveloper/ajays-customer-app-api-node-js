module.exports = (sequelize, DataTypes) => {
    const itemHistoryModel = sequelize.define("ItemHistory",{
        ID:{
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        LocationID:{
            type: DataTypes.INTEGER,
        },
        ItemID:{
            type: DataTypes.INTEGER,
        },
        CategoryID:{
            type: DataTypes.INTEGER,
        },
        Count:{
            type: DataTypes.INTEGER,
        },
    
    },{timestamps: false}
);
    return itemHistoryModel;
}