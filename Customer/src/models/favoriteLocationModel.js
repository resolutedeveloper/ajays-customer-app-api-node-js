module.exports = (sequelize ,DataTypes) =>{
    const favoriteLocationModel = sequelize.define("favoriteLocation" ,{
        FavoriteLocationID: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4, 
            primaryKey: true
        },
        CustomerID:{
            type: DataTypes.UUID,
            allowNull: false
        },
        LocationID:{
            type: DataTypes.INTEGER(12),
            allowNull: false
        },
        CreatedOn:{
            type:DataTypes.DATE,
            allowNull:false
        },
    },{
        timestamps:false,
    });
    return favoriteLocationModel;
}