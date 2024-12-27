module.exports = (sequelize , DataTypes) =>{
    const customerEmailModel = sequelize.define("CustomerEmail" ,{
        CustomerEmailID: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4, 
            primaryKey: true
        },
        CustomerID:{
            type: DataTypes.UUID,
            allowNull: false
        },
        EmailID:{
            type: DataTypes.STRING(256),
        },
        IsDeleted:{
            type:DataTypes.BOOLEAN,
            allowNull: false
        },
        IsDeleted:{
            type:DataTypes.BOOLEAN,
            allowNull: false
        },
    },{
        timestamps: false,
    })
    return customerEmailModel;
};