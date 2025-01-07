module.exports =(sequelize, DataTypes)=>{
    const ratingItemModel = sequelize.define("RatingItem",{
        RatingItemID: {
            type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        },
        OrderID:{
            type: DataTypes.UUID,
            allowNull: false,
        },
        OrderDetailsID:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        CustomerID:{
            type: DataTypes.UUID,
            allowNull: false,
        },
        LocationID:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        ItemID:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        Rating:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        Remark:{
            type: DataTypes.STRING,
        },
        CreatedOn: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },{timestamps: false});

    return ratingItemModel;
}