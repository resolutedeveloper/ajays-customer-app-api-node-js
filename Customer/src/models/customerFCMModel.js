module.exports = (sequelize ,DataTypes) =>{
    const customerFCMModel  = sequelize.define("customerFCM" ,{
        CustomerFCMID: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4, 
            primaryKey: true
        },
        CustomerID:{
            type: DataTypes.UUID,
            allowNull: false
        },
        FCMKEY:{
            type: DataTypes.TEXT,
            allowNull:false
        },
    },{
        timestamps:false,
    });
    return customerFCMModel;
}