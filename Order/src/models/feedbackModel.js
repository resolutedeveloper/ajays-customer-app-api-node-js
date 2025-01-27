module.exports = (sequelize, DataTypes) => {
    const feedbackModel = sequelize.define("Feedback", {
        FeedbackID: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        CustomerID: {
            type: DataTypes.UUID,
            allowNull: false
        },
        ItemID: {
            type: DataTypes.STRING(256),
        },
        OrderID: {
            type: DataTypes.STRING(256),
        },
        feedBackStars: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        },
        feedBackComment: {
            type: DataTypes.STRING(256),
        },
        IsDeleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
    }, { timestamps: false });

    return feedbackModel;
}