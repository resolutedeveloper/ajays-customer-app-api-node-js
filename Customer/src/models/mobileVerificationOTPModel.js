module.exports = (sequelize ,DataTypes) =>{
    const mobileVerificationOTPModel = sequelize.define("mobileVerificationOTP" ,{
        MobileVerificationOTPID: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4, 
            primaryKey: true
        },
        CustomerID:{
            type: DataTypes.UUID,
            allowNull: true
        },
        PhoneNumber:{
            type: DataTypes.TEXT,
            allowNull:false
        },
        OTP:{
            type: DataTypes.INTEGER(6),
<<<<<<< HEAD
            allowNull: false
=======
            allowNull:false
>>>>>>> 63acf3e332013307f93588c7fc589f66a8608a4b
        },
        IsStatus:{
            type: DataTypes.BOOLEAN,
            allowNull:false
        },
        CreatedOn:{
            type:DataTypes.DATE,
            allowNull:false
        },
        UsedOn:{
            type:DataTypes.DATE,
            allowNull:false
        },
        ExpiredOn:{
            type:DataTypes.DATE,
            allowNull:false
        },
    },{
        timestamps:false,
    });
    return mobileVerificationOTPModel;
}