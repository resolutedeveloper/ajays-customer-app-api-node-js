module.exports =(sequelize, DataTypes)=>{
    const favoriteItemModel = sequelize.define("FavoriteItem",{
        FavoriteItemID: {
            type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        },
        CustomerID:{
            type: DataTypes.UUID,
            allowNull: false,
        },
        ItemID:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        ItemName:{
            type: DataTypes.STRING
        }
    },{timestamps: false});

    return favoriteItemModel;
}