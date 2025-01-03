module.exports =(sequelize, DataTypes)=>{
    const orderModel = sequelize.define("Order",{
        OrderID: {
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
            allowNull: false
        },
        ItemName:{
            type: DataTypes.STRING
        },
        MRP:{
            type: DataTypes.DECIMAL(8,4)
        },
        Quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            // defaultValue: 1,
          },
          OrderStatus: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Pending',
          },
    },{timestamps: false});

    return orderModel;
}