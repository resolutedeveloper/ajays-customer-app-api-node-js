module.exports = (sequelize ,DataTypes) =>{
    const customerVerManagementModel  = sequelize.define("customerVerManagement" ,{
        CustomerVerID: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4, 
            primaryKey: true
        },
        CustomerID:{
            type: DataTypes.UUID,
            allowNull: false
        },
        Version:{
            type: DataTypes.STRING(100),
            allowNull:false
        },
        CreateOn:{
            type:DataTypes.DATE,
            allowNull:false
        }
    },{
        timestamps:false,
    });
    return customerVerManagementModel;
}