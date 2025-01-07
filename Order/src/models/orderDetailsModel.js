module.exports =(sequelize, DataTypes)=>{
    const orderDetailsModel = sequelize.define("OrderDetails",{
        OrderDetailsID: {
            type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        },
        OrderID:{
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
        ItemName:{
            type: DataTypes.STRING
        },
        MRP:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        Quantity:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        SubTotal:{
                type: DataTypes.INTEGER,
                allowNull: false,
        }
    },{timestamps: false});

    return orderDetailsModel;
}