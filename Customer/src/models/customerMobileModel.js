module.exports = (sequelize ,DataTypes) =>{
    const customerMobileModel = sequelize.define("customerMobile" ,{
        CustomerMobileID:{
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        CustomerID:{
            type: DataTypes.UUID,
            allowNull: false
        },
        PhoneNumber:{
            type: DataTypes.STRING(15),
            allowNull: false
        },IsDeleted:{
            type:DataTypes.BOOLEAN,
            allowNull: false
        },
        IsDeleted:{
            type:DataTypes.BOOLEAN,
            allowNull: false
        },
    },{
        timestamps:false,
    });
    return customerMobileModel;
}