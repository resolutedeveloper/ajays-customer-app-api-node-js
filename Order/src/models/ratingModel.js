module.exports = (sequelize, DataTypes) => {
    const ratingModel = sequelize.define("Rating", {
        RatingID: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        OrderID: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        ItemID: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        CustomerID: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        LocationID: {
            type: DataTypes.INTEGER,
        },
        Rating: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        },
        Remark: {
            type: DataTypes.STRING,
        },
        CreatedOn: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    }, { timestamps: false });

    return ratingModel;
}