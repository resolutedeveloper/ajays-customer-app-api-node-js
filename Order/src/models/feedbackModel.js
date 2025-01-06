module.exports =(sequelize, DataTypes)=>{
    const feedbackModel = sequelize.define("Feedback",{
        FeedbackID: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        CustomerID: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        OrderID:{
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        Feedback: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
          
    },{timestamps: false});

    return feedbackModel;
}