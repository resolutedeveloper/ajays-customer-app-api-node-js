module.exports =(sequelize, DataTypes)=>{
    const ratingModel = sequelize.define("Rating",{
        RatingID: {
            type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        },
        OrderID:{
            type: DataTypes.UUID,
            allowNull: false,
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
        },
        Rating:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        Comment:{
            type: DataTypes.STRING
        },
        AverageRatingItem:{
                type: DataTypes.FLOAT,
        }
    },{timestamps: false});

    return ratingModel;
}