module.exports = (sequelize ,DataTypes) =>{
    const favoriteLocationModel = sequelize.define("favoriteLocation" ,{
        FavoriteLocationID: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4, 
            primaryKey: true
        },

        CustomerID: {
            type: DataTypes.UUID,
            allowNull: false
        },
        LocationID: {
            type: DataTypes.INTEGER(12),
            allowNull: false
        },
        CreatedOn: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: sequelize.NOW
        },
        IsActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true // Default value set to true
        },
        IsDeleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false, // Default value set to false
            comment: "1 : Deleted, 0: Not Deleted"
        },
    }, {
        timestamps: false,
    });
    return favoriteLocationModel;
};

